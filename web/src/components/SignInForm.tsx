import FormWrapper from "./FormWrapper";
import WalletConnectButton from "@/components/WalletConnectButton";

const UserInfoForm = () => {
  return (
    <FormWrapper
      title="Sign In"
      description="Please connect your wallet to sign in."
    >
      <div className="w-full flex flex-col gap-5">
        <WalletConnectButton />
      </div>
    </FormWrapper>
  );
};

export default UserInfoForm;
