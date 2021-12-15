import { Token } from "../main";


export interface WalletBalanceProps {
    token: Token
}



export const WalletBalance = ({ token }: WalletBalanceProps) => {
    const { image, address, name } = token
}