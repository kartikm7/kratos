#!/usr/bin/env bash

os=$(uname -s)

# Formatting os for matching binary naming convenction
if [[ $os == "Linux" ]]; then
  os="linux"
else
  os="darwin"
fi

arch=$(uname -m)

if [[ $arch == *"arm"* ]]; then
  arch="arm64"
elif [[ $arch == *"64"* ]]; then
  arch="x64"
else
  arch="x86"
fi

binary_name="kratos-$os-$arch"
binary_url="https://github.com/kartikm7/kratos/releases/latest/download/$binary_name"
path="$HOME/.local/bin"

binary_path="$path/kratos"

# removing older version, before downloading new one
rm $binary_path 2>/dev/null

curl -L --progress-bar $binary_url --create-dirs -O --output-dir $path

# renaming binary
mv "$path/$binary_name" $binary_path

chmod +x $binary_path

echo "   ▄█   ▄█▄    ▄████████    ▄████████     ███      ▄██████▄     ▄████████
  ███ ▄███▀   ███    ███   ███    ███ ▀█████████▄ ███    ███   ███    ███
  ███▐██▀     ███    ███   ███    ███    ▀███▀▀██ ███    ███   ███    █▀ 
 ▄█████▀     ▄███▄▄▄▄██▀   ███    ███     ███   ▀ ███    ███   ███       
▀▀█████▄    ▀▀███▀▀▀▀▀   ▀███████████     ███     ███    ███ ▀███████████
  ███▐██▄   ▀███████████   ███    ███     ███     ███    ███          ███
  ███ ▀███▄   ███    ███   ███    ███     ███     ███    ███    ▄█    ███
  ███   ▀█▀   ███    ███   ███    █▀     ▄████▀    ▀██████▀   ▄████████▀ 
  ▀           ███    ███                                                 "

echo "Aims to assist not replace."

if ! where kratos; then
  export PATH="$HOME/.local/bin:$PATH"
  echo "NOTE: Add kratos to your path (for it to persist)"
  echo "export PATH=\"\$HOME/.local/bin:\$PATH\""
fi
