export default interface UserData {
  userID: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  admin: boolean;
  promotion: boolean;
  userStatusID: number;
  homeAddressID: number;
  verificationToken: number;
}
