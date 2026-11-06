$architecture = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture
$arch = switch ($architecture) {
    "X64"  { "x64" }
    "X86"  { "x86" }
    "Arm"  { "arm64" } # just for simplicity sakes
    "Arm64" { "arm64" }
    Default { "unknown" }
}
$path = $env:APPDATA + "\kratos"
$binary = "kratos-windows-"+$arch+".exe"
$binary_path = $path + "\" + $binary
$url = "https://github.com/kartikm7/kratos/releases/latest/download/" + $binary

mkdir $path 2>$null

echo "Downloading Kartos"

curl -L --progress-bar $url --create-dirs -O --output-dir $path


echo "Downloaded Kartos"

$old_binary_path = $path + "\kratos.exe"
rm $old_binary_path -fo

Rename-Item -Path $binary_path -NewName "kratos.exe" 2>$null

$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
[Environment]::SetEnvironmentVariable("Path", "$userPath;$path", "User")

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
