function convertPhoneNumber(phoneNumber: string): string {
  if (phoneNumber.startsWith('0')) {
    phoneNumber = '+62' + phoneNumber.slice(1);
  }
  return phoneNumber;
}
export default convertPhoneNumber;
