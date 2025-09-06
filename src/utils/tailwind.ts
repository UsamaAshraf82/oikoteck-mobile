import tailwindConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
// import type { ThemeConfig } from "tailwindcss/types/config";


const tailwind = resolveConfig(tailwindConfig) as ReturnType<typeof resolveConfig> & {
  theme: {
    colors: {
      primary: string;
      secondary: string;
      promote: string;
      promote_plus: string;
      gold: string;
      platinum: string;
      pending: string;
      active: string;
      expired: string;
      deleted: string;
      rejected: string;
      o_light_gray: string;
    };
  };
};

export default tailwind;
