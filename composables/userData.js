export const useUserData = () =>
  useState("userData", () => {
    return { uuid: "", id: "", name: "" };
  });
