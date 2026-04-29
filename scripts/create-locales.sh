#!/bin/bash

# Array der 35 Sprachen mit ihren Namen
# Format: CODE:NAME:IS_RTL
LANGUAGES=(
  "de:Deutsch:false"
  "en:English:false"
  "tr:Türkçe:false"
  "pl:Polski:false"
  "ru:Русский:false"
  "it:Italiano:false"
  "es:Español:false"
  "fr:Français:false"
  "ar:العربية:true"
  "fa:فارسی:true"
  "bg:Български:false"
  "hr:Hrvatski:false"
  "cs:Čeština:false"
  "da:Dansk:false"
  "nl:Nederlands:false"
  "et:Eesti:false"
  "fi:Suomi:false"
  "el:Ελληνικά:false"
  "hu:Magyar:false"
  "ga:Gaeilge:false"
  "lv:Latviešu:false"
  "lt:Lietuvių:false"
  "mt:Malti:false"
  "no:Norsk:false"
  "pt:Português:false"
  "ro:Română:false"
  "sk:Slovenčina:false"
  "sl:Slovenščina:false"
  "sv:Svenska:false"
  "uk:Українська:false"
  "sr:Српски:false"
  "mk:Македонски:false"
  "sq:Shqip:false"
  "bs:Bosanski:false"
  "is:Íslenska:false"
)

BASE_DIR="/data/.openclaw/workspace/public/locales"

for lang_info in "${LANGUAGES[@]}"; do
  IFS=':' read -r CODE NAME IS_RTL <<< "$lang_info"
  
  echo "Creating structure for $CODE ($NAME)..."
  
  mkdir -p "$BASE_DIR/$CODE"
  
  # Skip if it's German (already created) or copy from English and translate
  if [ "$CODE" = "de" ] || [ "$CODE" = "en" ] || [ "$CODE" = "ar" ]; then
    continue
  fi
  
  # Copy from English as base template for now
  cp "$BASE_DIR/en/common.json" "$BASE_DIR/$CODE/common.json"
  cp "$BASE_DIR/en/navigation.json" "$BASE_DIR/$CODE/navigation.json"
  cp "$BASE_DIR/en/buttons.json" "$BASE_DIR/$CODE/buttons.json"
  cp "$BASE_DIR/en/errors.json" "$BASE_DIR/$CODE/errors.json"
  cp "$BASE_DIR/en/pflegegrad.json" "$BASE_DIR/$CODE/pflegegrad.json"
  cp "$BASE_DIR/en/results.json" "$BASE_DIR/$CODE/results.json"
done

echo "All 35 language directories created!"
