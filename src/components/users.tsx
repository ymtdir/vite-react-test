import { useState, useEffect } from "react";
import { UserTable } from "@/components/user/user-table";
import type { User } from "@/types/api.ts";
import { UserService } from "@/services/user-service";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("ユーザー情報の取得に失敗:", err);
      setError("ユーザー情報の読み込みに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    console.log("新規ユーザー作成");
  };

  const handleUserUpdate = (updatedUser: User) => {
    // ユーザー情報が更新されたら、テーブルを再読み込み
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  const handleUserDelete = (userId: number) => {
    // ユーザーが削除されたら、テーブルから削除
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const handleBulkUserDelete = (userIds: number[]) => {
    // 複数のユーザーが削除されたら、テーブルから削除
    setUsers((prevUsers) =>
      prevUsers.filter((user) => !userIds.includes(user.id))
    );
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="space-y-4">
          <div className="p-4 border border-red-200 bg-red-50 rounded-md">
            <h3 className="text-red-800 font-medium">
              ユーザー情報の読み込みに失敗しました
            </h3>
            <p className="text-red-600 text-sm mt-1">
              データの取得中にエラーが発生しました。APIサーバーが起動しているか確認してください。
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-left">
              ユーザー管理
            </h1>
            <p className="text-muted-foreground">
              登録ユーザーの管理と詳細情報を確認できます。
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <Button onClick={handleAddUser} size="sm">
              <Plus className="h-4 w-4" />
              新規ユーザー
            </Button>
          </div>
        </div>
        <UserTable data={users} isLoading={isLoading} />
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="border-b p-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">ユーザー管理</h1>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
