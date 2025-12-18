"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { LogOut } from "lucide-react"

interface LogoutConfirmationProps {
  onLogout: () => Promise<void>
  isLoggingOut: boolean
}

export function LogoutConfirmation({ onLogout, isLoggingOut }: LogoutConfirmationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await onLogout()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-500 text-red-500 hover:bg-red-50 px-3 py-2 rounded-md flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader>
          <DialogTitle>تأكيد تسجيل الخروج</DialogTitle>
          <DialogDescription>هل أنت متأكد من أنك تريد تسجيل الخروج من النظام؟</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoggingOut}>
            إلغاء
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                جاري تسجيل الخروج...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
