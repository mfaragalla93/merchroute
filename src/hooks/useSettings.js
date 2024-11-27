import { useEffect, useMemo, useState } from "react";

const defaultSettings = {
  merchantingLevel: 100, // Intentionally defaulted for now since higher levels have no images yet.
  detectiveLevel: 0,
  battleOfFortuneholdCompleted: false,
  roundTrip: true,
};

const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const settingsJson = localStorage.getItem("settings");
    return settingsJson ? JSON.parse(settingsJson) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const merchantingLevel = useMemo(() => {
    return settings.merchantingLevel;
  }, [settings]);

  const detectiveLevel = useMemo(() => {
    return settings.detectiveLevel;
  }, [settings]);

  const battleOfFortuneholdCompleted = useMemo(() => {
    return settings.battleOfFortuneholdCompleted;
  }, [settings]);

  const roundTrip = useMemo(() => {
    if (settings.roundTrip === undefined) {
      return true; // Default to true if not set (old settings)
    }

    return settings.roundTrip;
  }, [settings]);

  const setMerchantingLevel = (merchantingLevel) => {
    setSettings((settings) => ({
      ...settings,
      merchantingLevel: merchantingLevel === "" ? "" : Number(merchantingLevel),
    }));
  };

  const setDetectiveLevel = (detectiveLevel) => {
    setSettings((settings) => ({
      ...settings,
      detectiveLevel: detectiveLevel === "" ? "" : Number(detectiveLevel),
    }));
  };

  const setBattleOfFortuneholdCompleted = (battleOfFortuneholdCompleted) => {
    setSettings((settings) => ({
      ...settings,
      battleOfFortuneholdCompleted,
    }));
  };

  const setRoundTrip = (roundTrip) => {
    setSettings((settings) => ({
      ...settings,
      roundTrip,
    }));
  };

  return {
    merchantingLevel,
    detectiveLevel,
    battleOfFortuneholdCompleted,
    roundTrip,
    setMerchantingLevel,
    setDetectiveLevel,
    setBattleOfFortuneholdCompleted,
    setRoundTrip,
  };
};

export default useSettings;
