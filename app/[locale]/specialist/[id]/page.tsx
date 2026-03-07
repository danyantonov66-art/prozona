# Постави съдържанието (copy-paste от сваления файл в clipboard, после:)
Get-Clipboard | Set-Content -LiteralPath "app\[locale]\specialist\[id]\page.tsx" -Encoding UTF8
git add "app/[locale]/specialist/[id]/page.tsx"
git commit -m "fix: specialist page remove categories/gallery relations"
git push
