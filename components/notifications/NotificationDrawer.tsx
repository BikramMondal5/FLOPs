"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  TrendingUp,
  Target,
  PieChart,
  FileText,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { NotificationDTO } from "@/features/notifications/dto/notification.dto";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (json.success && json.data) {
        setNotifications(json.data.notifications);
        setUnreadCount(json.data.totalUnread);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleNotificationClick = (notification: NotificationDTO) => {
    handleMarkAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      onClose();
    }
  };

  const getIcon = (type: string, severity: string) => {
    if (type === "ai") return <Sparkles className="w-5 h-5" />;
    if (type === "budget") return <PieChart className="w-5 h-5" />;
    if (type === "goal") return <Target className="w-5 h-5" />;
    if (type === "report") return <FileText className="w-5 h-5" />;
    if (type === "health") return <Activity className="w-5 h-5" />;

    if (severity === "critical") return <AlertCircle className="w-5 h-5" />;
    if (severity === "warning") return <AlertTriangle className="w-5 h-5" />;
    if (severity === "success") return <CheckCircle className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  const getColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-rose-600 bg-rose-50 border-rose-200";
      case "warning":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "success":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-[#D46A96] bg-[#FFF4F8] border-[#F6B7CF]/30";
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-200">
              <div>
                <h2 className="text-xl font-semibold text-zinc-800 m-0">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-sm text-zinc-500 mt-1">
                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5 text-zinc-600" />
              </button>
            </div>

            {/* Mark all as read */}
            {unreadCount > 0 && (
              <div className="px-6 py-3 border-b border-zinc-100">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm font-medium text-[#D46A96] hover:text-[#B85578] transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-3 border-[#F6B7CF] border-t-[#D46A96] rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                  <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-800 mb-2">You're all caught up!</h3>
                  <p className="text-sm text-zinc-500">No notifications at the moment.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 hover:bg-zinc-50 cursor-pointer transition-colors ${
                        !notif.read ? "bg-[#FFF4F8]/30" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getColor(notif.severity)}`}>
                          {getIcon(notif.type, notif.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm font-semibold text-zinc-800 m-0">{notif.title}</h4>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-[#D46A96] rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-zinc-600 mb-2 leading-relaxed">{notif.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-zinc-400">{getTimeAgo(notif.createdAt)}</span>
                            {notif.actionLabel && (
                              <span className="text-xs font-medium text-[#D46A96]">{notif.actionLabel} →</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
