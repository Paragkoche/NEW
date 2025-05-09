import LoginFrom from "./_forms/login.forms";
const page = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="card bg-base-100 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Login</h2>
          <LoginFrom />
        </div>
      </div>
    </div>
  );
};

export default page;
