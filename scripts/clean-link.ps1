# clean-link.ps1
# Removes node_modules directories (and optional build artifacts) from the
# monorepo root and all workspace packages so a fresh install can be performed.

param(
    [switch]$Build
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

function Remove-DirectoryIfExists {
    param([string]$Path)
    if (Test-Path $Path) {
        Write-Host "Removing $Path ..."
        Remove-Item -Recurse -Force $Path
    }
}

Write-Host "Cleaning node_modules in $RootDir ..."
Remove-DirectoryIfExists (Join-Path $RootDir 'node_modules')

Write-Host "Cleaning node_modules in $RootDir\docs ..."
Remove-DirectoryIfExists (Join-Path $RootDir 'docs' 'node_modules')

if ($Build) {
    Write-Host "Cleaning build artifacts in $RootDir ..."
    Remove-DirectoryIfExists (Join-Path $RootDir 'dist')
}

Write-Host "Done."
