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
        <p className="text-[11px] lg:text-xs xl:text-sm font-medium text-gray-700">
          {title}
        </p>
        <p className="text-[10px] lg:text-[10px] xl:text-xs text-gray-500">
          {subtitle}
        </p>
      </div>

      <label className="relative inline-flex items-center cursor-pointer ml-3 lg:ml-4">

        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
          className="sr-only peer"
        />

        {/* Track */}
        <div
          className="
            w-8 h-4
            lg:w-9 lg:h-[18px]
            xl:w-10 xl:h-5
            bg-gray-300 rounded-full
            peer peer-checked:bg-green-500
            transition
          "
        />

        {/* Thumb */}
        <div
          className="
            absolute left-0.5 top-0.5
            w-3 h-3
            lg:w-3.5 lg:h-3.5
            xl:w-4 xl:h-4
            bg-white rounded-full transition
            peer-checked:translate-x-4
            lg:peer-checked:translate-x-[18px]
            xl:peer-checked:translate-x-5
          "
        />

      </label>

    </div>
  );
};

export default function AlertsSection() {

  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  return (
    <div className="mt-6 lg:mt-7 xl:mt-14">

      <h2
        className="
          text-gray-600 font-semibold
          text-sm lg:text-sm xl:text-base
          mb-4 lg:mb-4 xl:mb-8
        "
      >
        Alerts
      </h2>

      <div className="grid grid-cols-2 gap-8 lg:gap-10 xl:gap-20">

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