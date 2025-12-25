import Navbar from "../components/Navbar";
const RefundPolicy = () => {
  return (
    <div className="flex flex-col">
      <Navbar showoptions={false} />

      <div className="min-h-screen bg-blue-50 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">
            Return Policy
          </h1>

          <div className="text-gray-700 leading-relaxed space-y-6">
            <p>
              We offer refund / exchange within first 1 days 1 days from the
              date of your purchase. If have passed since your purchase, you
              will not be offered a return, exchange or refund of any kind. In
              order to become eligible for a return or an exchange, (i) the
              purchased item should be unused and in the same condition as you
              received it, (ii) the item must have original packaging, (iii) if
              the item that you purchased on a sale, then the item may not be
              eligible for a return / exchange. Further, only such items are
              replaced by us (based on an exchange request), if such items are
              found defective or damaged.
            </p>
          </div>
          <div>
            <p>
              You agree that there may be a certain category of products / items
              that are exempted from returns or refunds. Such categories of the
              products would be identified to you at the item of purchase. For
              exchange / return accepted request(s) (as applicable), once your
              returned product / item is received and inspected by us, we will
              send you an email to notify you about receipt of the returned /
              exchanged product. Further. If the same has been approved after
              the quality check at our end, your request (i.e. return /
              exchange) will be processed in accordance with our policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
