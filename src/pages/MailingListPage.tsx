import MailingListForm from '../components/MailingListForm';

const NewsSignUpPage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Join Our Mailing List!</h1>
          <p className="text-muted-foreground text-xl">
            Enter your email to receive the latest news and updates from the ICAA.
          </p>
        </div>
        <MailingListForm />
      </div>
    </div>
  );
};

export default NewsSignUpPage;