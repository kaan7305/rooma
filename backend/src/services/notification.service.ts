import supabase from '../config/supabase';

interface CreateNotificationInput {
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Create a notification for a user
 */
export const createNotification = async (input: CreateNotificationInput) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: input.user_id,
        type: input.type,
        title: input.title,
        message: input.message,
        data: input.data || {},
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create notification:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Notification creation error:', err);
    return null;
  }
};

/**
 * Create multiple notifications at once
 */
export const createNotifications = async (inputs: CreateNotificationInput[]) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(
        inputs.map((input) => ({
          user_id: input.user_id,
          type: input.type,
          title: input.title,
          message: input.message,
          data: input.data || {},
        }))
      )
      .select();

    if (error) {
      console.error('Failed to create notifications:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Notifications creation error:', err);
    return [];
  }
};
