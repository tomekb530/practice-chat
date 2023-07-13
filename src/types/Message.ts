export class Message{
    message: string
    user: string
    displayName: string
    timestamp: number
    avatarUrl: string
    constructor(message: string, user: string, displayName: string, timestamp: number, avatarUrl: string){
        this.message = message
        this.user = user
        this.displayName = displayName
        this.timestamp = timestamp
        this.avatarUrl = avatarUrl
    }
}