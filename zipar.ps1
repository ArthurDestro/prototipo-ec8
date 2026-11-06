# Cria MVP.zip na pasta Documentos, sem as pastas pesadas que se recriam sozinhas.
$origem = $PSScriptRoot
$destino = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'MVP.zip'
$ignorar = '\\(node_modules|\.gradle|\.idea|\.claude)(\\|$)|\\android\\(app\\)?build(\\|$)'

$arquivos = Get-ChildItem $origem -Recurse -File -Force | Where-Object { $_.FullName -notmatch $ignorar }

if (Test-Path $destino) { Remove-Item $destino }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::Open($destino, 'Create')
foreach ($a in $arquivos) {
  $relativo = $a.FullName.Substring($origem.Length + 1)
  [void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $a.FullName, "MVP\$relativo")
}
$zip.Dispose()

"{0:N1} MB em {1}" -f ((Get-Item $destino).Length / 1MB), $destino
