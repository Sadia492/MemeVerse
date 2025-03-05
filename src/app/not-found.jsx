import errorImg from "@/assets/Creative-Funny-404-Pages-removebg-preview.png";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex justify-center mt-24 items-center flex-col">
      <Image src={errorImg} alt="error"></Image>

      <h1 className="font-bold text-3xl">404 - Page Not Found</h1>
      <p>The page you're looking for does not exist.</p>
    </div>
  );
}
