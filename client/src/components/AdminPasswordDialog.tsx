import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AdminPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = "pizza2024"; // 管理員密碼

export function AdminPasswordDialog({
  open,
  onOpenChange,
  onSuccess,
}: AdminPasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim()) {
      setError("請輸入密碼");
      return;
    }

    setIsLoading(true);
    setError("");

    // 模擬密碼驗證延遲
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      setPassword("");
      onOpenChange(false);
      onSuccess();
    } else {
      setError("密碼錯誤，請重試");
      setPassword("");
    }

    setIsLoading(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen === false) {
      setPassword("");
      setError("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>管理員區域</DialogTitle>
          <DialogDescription>
            請輸入管理員密碼以訪問管理功能
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Input
            type="password"
            placeholder="輸入管理員密碼"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSubmit();
              }
            }}
            disabled={isLoading}
            className="text-black placeholder-gray-400"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !password.trim()}
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              {isLoading ? "驗證中..." : "確認"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
