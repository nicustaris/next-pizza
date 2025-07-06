import { InfoBlock } from "@/shared/components";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-40">
      <InfoBlock
        title="Unauthorized"
        text="This page can be accessed only by logged in users"
        imageUrl="/assets/images/lock.png"
      />
    </div>
  );
}
