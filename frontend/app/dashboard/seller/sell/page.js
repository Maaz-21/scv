import SellItemForm from "@/components/forms/SellItemForm";
import SellerLayout from "@/components/layouts/SellerLayout";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";

export default function SellItemPage() {
  return (
    <ProtectedLayout allowedRoles={["seller"]}>
      <SellerLayout>
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <SellItemForm />
        </div>
      </SellerLayout>
    </ProtectedLayout>
  );
}
