ng build

if(Test-Path -Path "docs")
{
    Remove-Item -Path "docs" -Recurse
}

Move-Item -Path "dist/bitmap-font-generator" -Destination "docs"