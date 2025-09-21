import type { User } from "@/types/api.ts";

const API_BASE_URL = "/api";

// APIレスポンス用の型（実際のAPIレスポンスに合わせる）
type ApiUser = {
  id: number;
  name: string;
  email: string;
};

export class UserService {
  /**
   * 全ユーザーを取得
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      console.log("API呼び出し開始:", `${API_BASE_URL}/users/`);
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // クッキーを含める
      });

      console.log("APIレスポンス:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiUser[] = await response.json();
      console.log("APIレスポンスデータ:", data);

      // APIレスポンスをUser型に変換（不足フィールドをデフォルト値で補完）
      const users: User[] = data.map((user) => ({
        ...user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      }));

      console.log("変換後のユーザーデータ:", users);
      return users;
    } catch (error) {
      console.error("ユーザー一覧の取得に失敗:", error);
      throw error;
    }
  }

  /**
   * ユーザーを作成
   */
  static async createUser(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("ユーザー作成に失敗:", error);
      throw error;
    }
  }

  /**
   * ユーザーを更新
   */
  static async updateUser(
    userId: number,
    userData: Partial<User>
  ): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("ユーザー更新に失敗:", error);
      throw error;
    }
  }

  /**
   * ユーザーを削除
   */
  static async deleteUser(userId: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("ユーザー削除に失敗:", error);
      throw error;
    }
  }

  /**
   * 複数ユーザーを一括削除
   */
  static async bulkDeleteUsers(userIds: number[]): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/bulk-delete/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("一括削除に失敗:", error);
      throw error;
    }
  }
}
