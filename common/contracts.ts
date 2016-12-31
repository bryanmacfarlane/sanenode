export interface IStringDictionary { [name: string]: string }

export interface IApiCredential {
    credentialtype: string,
    data: IStringDictionary
}

export interface IQuote {
    quote: string,
    author: string
}