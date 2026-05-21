type ProviderDetails = {
  id?: string,
  env?: string[],
  npm?: string,
  doc?: string,
  models: string
}

type ModelsList = {
  [key: symbol]: ProviderDetails
}


export { type ProviderDetails, type ModelsList }
