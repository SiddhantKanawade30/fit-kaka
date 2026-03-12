import { UserRepository } from "../database/index.js";
import { sendWhatsAppMessage } from "../utils/index.js";
import { sendVegetarianOptions } from "../utils/whatsapp.js";

interface UserDataStatus {
  needsAge: boolean;
  needsHeight: boolean;
  needsWeight: boolean;
  needsTargetWeight: boolean;
  needsVegetarian: boolean;
  nextQuestion?: string | undefined;
}

export class UserDataService {
  static readonly DATA_FRESHNESS_DAYS = 20;

  static isDataFresh(date?: Date): boolean {
    if (!date) return false;
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= this.DATA_FRESHNESS_DAYS;
  }

  static async getUserDataStatus(phone: string): Promise<UserDataStatus> {
    const user = await UserRepository.findByPhone(phone);
    
    if (!user) {
      return {
        needsAge: true,
        needsHeight: true,
        needsWeight: true,
        needsTargetWeight: true,
        needsVegetarian: true,
        nextQuestion: 'current_weight'
      };
    }

    const ageFresh = this.isDataFresh(user.ageUpdatedAt);
    const heightFresh = this.isDataFresh(user.heightUpdatedAt);
    const weightFresh = this.isDataFresh(user.weightUpdatedAt);
    const targetWeightFresh = this.isDataFresh(user.targetWeightUpdatedAt);
    const vegetarianFresh = this.isDataFresh(user.vegetarianUpdatedAt);

    const needsAge = !user.age || !ageFresh;
    const needsHeight = !user.height || !heightFresh;
    const needsWeight = !user.weight || !weightFresh;
    const needsTargetWeight = !user.targetWeight || !targetWeightFresh;
    const needsVegetarian = user.isVegetarian === undefined || !vegetarianFresh;

    // Determine next question
    let nextQuestion: string | undefined;
    if (needsWeight) nextQuestion = 'current_weight';
    else if (needsTargetWeight) nextQuestion = 'target_weight';
    else if (needsAge) nextQuestion = 'age';
    else if (needsHeight) nextQuestion = 'height';
    else if (needsVegetarian) nextQuestion = 'vegetarian';

    return {
      needsAge,
      needsHeight,
      needsWeight,
      needsTargetWeight,
      needsVegetarian,
      nextQuestion: nextQuestion || undefined
    };
  }

  static async updateUserField(phone: string, field: string, value: any): Promise<void> {
    const updateData: any = {};
    const timestampField = `${field}UpdatedAt`;
    
    updateData[field] = value;
    updateData[timestampField] = new Date();

    await UserRepository.updateUser(phone, updateData);
  }

  static async startWeightLossDataCollection(phone: string): Promise<void> {
    const status = await this.getUserDataStatus(phone);
    
    if (!status.needsAge && !status.needsHeight && !status.needsWeight && 
        !status.needsTargetWeight && !status.needsVegetarian) {
      // All data is fresh, proceed to diet plan
      const { DietService } = await import("./diet.service.js");
      await DietService.handleVegetarianStatus(phone, '2', 'weight_loss');
      return;
    }

    // Start asking questions from the first missing data point
    await this.askNextQuestion(phone, status);
  }

  static async askNextQuestion(phone: string, status: UserDataStatus): Promise<void> {
    switch (status.nextQuestion) {
      case 'current_weight':
        await sendWhatsAppMessage(phone, 
          "🎯 *Weight Loss Plan*\n\n" +
          "Let's gather some information to create your personalized diet plan.\n\n" +
          "What is your current weight in kg?\n\n" 
        );
        break;
      
      case 'target_weight':
        await sendWhatsAppMessage(phone, 
          "Great! What is your target weight in kg?\n\n"
        );
        break;
      
      case 'age':
        await sendWhatsAppMessage(phone, 
          "What is your age?\n\n" 
        );
        break;
      
      case 'height':
        await sendWhatsAppMessage(phone, 
          "What is your height in cm?\n\n" 
        );
        break;
      
      case 'vegetarian':
        await sendVegetarianOptions(phone, "Are you vegetarian?");
        break;
      
      default:
        // All data collected, proceed to diet plan
        const { DietService } = await import("./diet.service.js");
        await DietService.handleVegetarianStatus(phone, '2', 'weight_loss');
    }
  }

  static async handleWeightLossResponse(phone: string, message: string): Promise<void> {
    const status = await this.getUserDataStatus(phone);
    const value = message.trim();

    // Parse and validate the response based on current question
    switch (status.nextQuestion) {
      case 'current_weight':
        const currentWeight = parseFloat(value);
        if (isNaN(currentWeight) || currentWeight < 20 || currentWeight > 400) {
          await sendWhatsAppMessage(phone, 
            "Please enter a valid weight between 20-400 kg.\n\n" 
          );
          return;
        }
        await this.updateUserField(phone, 'weight', currentWeight);
        break;

      case 'target_weight':
        const targetWeight = parseFloat(value);
        if (isNaN(targetWeight) || targetWeight < 20 || targetWeight > 400) {
          await sendWhatsAppMessage(phone, 
            "Please enter a valid target weight between 20-400 kg.\n\n" 
          );
          return;
        }
        await this.updateUserField(phone, 'targetWeight', targetWeight);
        break;

      case 'age':
        const age = parseInt(value);
        if (isNaN(age) || age < 10 || age > 120) {
          await sendWhatsAppMessage(phone, 
            "Please enter a valid age between 10-120 years.\n\n" 
          );
          return;
        }
        await this.updateUserField(phone, 'age', age);
        break;

      case 'height':
        const height = parseFloat(value);
        if (isNaN(height) || height < 90 || height > 250) {
          await sendWhatsAppMessage(phone, 
            "Please enter a valid height between 90-250 cm.\n\n" 
          );
          return;
        }
        await this.updateUserField(phone, 'height', height);
        break;

      case 'vegetarian':
        const isVegetarian = value === '1' || value.toLowerCase() === 'yes' || value.toLowerCase() === 'vegetarian';
        await this.updateUserField(phone, 'isVegetarian', isVegetarian);
        
        // All data collected, proceed to diet plan
        const { DietService } = await import("./diet.service.js");
        await DietService.handleVegetarianStatus(phone, isVegetarian ? '1' : '2', 'weight_loss');
        return;

      default:
        return;
    }

    // Get updated status and ask next question
    const updatedStatus = await this.getUserDataStatus(phone);
    await this.askNextQuestion(phone, updatedStatus);
  }

  static formatUserDataSummary(user: any): string {
    return `📋 *Your Profile Summary*\n\n` +
      `🏋️ Current Weight: ${user.weight || 'Not set'} kg\n` +
      `🎯 Target Weight: ${user.targetWeight || 'Not set'} kg\n` +
      `🎂 Age: ${user.age || 'Not set'} years\n` +
      `📏 Height: ${user.height || 'Not set'} cm\n` +
      `🥗 Diet: ${user.isVegetarian !== undefined ? (user.isVegetarian ? 'Vegetarian' : 'Non-vegetarian') : 'Not set'}\n\n` +
      `💡 *Note:* We update this information every 20 days to keep your diet plan relevant!`;
  }
}
