try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/pictogramas" -Method GET
    Write-Host "Response received:"
    $response | ConvertTo-Json -Depth 3
}
catch {
    Write-Host "Error: $_"
}