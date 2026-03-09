import { useState } from "react";

const Toggle = ({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: () => void;
}) => {
  return (
    <div className="flex items-center justify-between">

      <div>
        <p className="text-sm font-medium text-gray-700">
          {title}
        </p>

        <p className="text-xs text-gray-500">
          {subtitle}
        </p>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">

        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          className="sr-only peer"
        />

        <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>

        <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>

      </label>

    </div>
  );
};

export default function AlertsSection() {

  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  return (
    <div className="mt-14">

      <h2 className="text-gray-600 font-semibold mb-8">
        Alerts
      </h2>

      <div className="grid grid-cols-2 gap-20">

        <Toggle
          title="Notifications"
          subtitle="Receive updates via Notifications"
          value={notifications}
          onChange={() => setNotifications(!notifications)}
        />

        <Toggle
          title="SMS Alerts"
          subtitle="Get important alerts via SMS"
          value={smsAlerts}
          onChange={() => setSmsAlerts(!smsAlerts)}
        />

      </div>

    </div>
  );
}