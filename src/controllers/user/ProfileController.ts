import BaseController from ".."
import * as moment from 'moment'
import * as EmailValidator from 'email-validator'
import * as R from 'ramda'
const sendgridMail = require('@sendgrid/mail')

import UserModel, {User} from "../../models/User"
import UserActivationKeyModel, { UserActivationKey } from '../../models/UserActivationKey'

import generateRandomHex from '../../helpers/generateRandomHex'

interface ProfileUpdateFormFields {
    username?: string,
    slug?: string,
    email?: string
    oldPassword?: string,
    newPassword?: string,
    action?: string,
    createTime?: string,
    gravatar?: string
}

interface SuccessMessages {
    changeEmail?: boolean,
    changePw?: boolean
}

const PASSWORD_LENGTH_MIN: number = 12

export default class ProfileController extends BaseController{
    public get(): void {
        this.db.find<User>("User", {
            _id: this.req.user.id
        }).then(user => {
            const [dataJson] = user;
            const data = {
                "values":{
                    username: dataJson.username,
                    email: dataJson.email,
                    gravatar: dataJson.gravatar,
                    createTime: moment(dataJson.createdAt).toString(),
                    slug: dataJson.slug
                }  
            };
            this.render("user/profile", data)
        })
        .catch(this.answerError)
    }

    public post(): void {
        const errors: ProfileUpdateFormFields = {}
        const success: SuccessMessages = {}
        const { username, email, oldPassword, newPassword, action } = this.req.body as ProfileUpdateFormFields;
    
        if(action === "Update Profile"){
            UserModel.findByUsername(username, true, (err, acc) => {
                if(acc.username == username && acc.email == email && newPassword.length === 0)
                    return this.render('user/profile', { errors, values: this.req.body })

                //User did some changes:
                if (typeof email !== 'string' || email.length === 0) {
                    errors.email = 'You must enter an email.'
                } else if (!EmailValidator.validate(email)) {
                    errors.email = 'You must enter a valid email.'
                } else if (email.toLowerCase() !== email) {
                    errors.email = 'Your new email must be in lowercase.'
                } 
        
                
                if (oldPassword === newPassword && newPassword.length != 0) {
                    errors.newPassword = 'Your new password can not be the same as the old one.'
                }

                if (!R.equals(errors, {})) return this.render('user/profile', { errors, "values": this.req.body })

                UserModel.authenticate()(username, oldPassword, (err, user) => {

                    if(err) {
                        this.answerError(err);
                        return
                    }
                        
                    if(!user){
                        errors.oldPassword = "You old password is incorrect.";
                        return this.render('user/profile', { errors, "values": this.req.body })
                    }
                    
                    new Promise( async(resolve, reject) => {
                        if(newPassword.length !== 0 && newPassword.length >= PASSWORD_LENGTH_MIN && typeof newPassword == 'string'){
                        
                            let theResult = await new Promise((resolve, reject) => {
                                acc.changePassword(oldPassword, newPassword, (error : Error, newUser : User) => {
                                    if(error) return resolve(false)
                                    resolve(true)
                                })
                            })
                            
                            if(!theResult) {
                                errors.oldPassword = "You old password is incorrect.";
                                return reject()
                            }else{
                                success.changePw = true;
                            }

                            theResult = await new Promise((resolve, reject) => {
                                UserModel.update({username: username}, {updatedAt: new Date()}, (err, raw) => {
                                    if(err) return resolve(false)
                                    resolve(true)
                                })
                            })

                            if(!theResult) return reject("Can't Update the last update time.");

                            if(theResult && email == acc.email){
                                return resolve();
                            } 
                        }

                        if(email.length !== 0 && email != acc.email){
                            this.db.find<User>("User", {email}).then(async (userList: User[]) => {
                                if(userList.length != 0){
                                    errors.email = "This email is already attached to an account.";
                                    return reject();
                                }

                                let theResult = await new Promise((resolve, reject) => {
                                    UserModel.update({username: username}, {email: email, updatedAt: new Date(), isActivated: false}, (err, raw) => {
                                        if(err) return resolve(false)
                                        resolve(true)
                                    })
                                });
                            
                                if(!theResult) return reject("Can't Update Database");
                                

                                const userActivationKeyModel: UserActivationKey = new UserActivationKeyModel({
                                    user,
                                    key: generateRandomHex(),
                                    createdAt: new Date(),
                                })
                        
                                userActivationKeyModel.save((err: Error, userActivationKey: UserActivationKey) => {
                                    if (err !== null) {
                                      return reject(err);
                                    }
                        
                                    const uri: string = `${process.env.BASE_URL}/activate?key=${userActivationKey.key}`
                        
                                    sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)
                                    sendgridMail.send({
                                      to: email,
                                      from: 'Electra Bay <help@electra-bay.com>',
                                      subject: 'Please confirm your email address to activate your account',
                                      text: `You will confirm your email address and activate your account
                                            by clicking on the following link: ${uri}`,
                                      html: `<p>You will confirm your email address and activate your account
                                            by clicking on the following link:<p>
                                            <p><a href="${uri}">${uri}</a></p>`,
                                    })
                                    success.changeEmail = true;
                                    resolve();
                                });
                            })
                        }
                        
                    }).then(() => this.render("user/profile", {errors, success, "values": this.req.body}))
                    .catch((err)=>{
                        if(err) this.answerError(err);
                        else this.render('user/profile', { errors, success, "values": this.req.body })
                    })
                });
           
            });
        }else{

        }
    }
}