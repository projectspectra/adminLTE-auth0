export class SessionUser {
    constructor(data?: SessionUser) {
        if(!data) return;
        if(data.name) this.name = data.name;
        if(data.email) this.email = data.email;
        if(data.sub) this.sub = data.sub;
        if(data.email_verified) this.email_verified = data.email_verified;
        if(data.phone_number) this.phone_number = data.phone_number;
        if(data.phone_number_verified) this.phone_number_verified = data.phone_number_verified;
        if(data.username) this.username = data.username;
    }
    public name: string = 'Anonymous';
    public email: string = 'an@ny.mous';
    public sub: string = '12345678-1234-1234-1234-123456789012';
    public email_verified: boolean = false;
    public phone_number: string = '12345678901';
    public phone_number_verified: boolean = false;
    public username: string = '12345678-1234-1234-1234-123456789012';
}