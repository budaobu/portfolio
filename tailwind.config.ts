import type { Config } from 'tailwindcss'

export default <Config>{
  theme: {
    extend: {
      fontFamily: {
        // 将落霞孤鹜字体设为首选 sans 字体，并保留系统默认字体作为后备
        sans: ['"LXGW WenKai Screen"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
}