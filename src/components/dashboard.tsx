import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-5">
      <h1 className="text-3xl font-bold">ダッシュボード</h1>
      <Button onClick={handleLogout}>ログアウト</Button>
    </div>
  );
}
