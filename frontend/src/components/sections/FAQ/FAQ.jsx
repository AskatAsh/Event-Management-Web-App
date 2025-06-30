import { Link } from "react-router";

const FAQ = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Questions & Answers
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-300">
            Explore the common questions and answers about Eventor
          </p>
        </div>

        <div className="grid grid-cols-1 mt-12 md:mt-20 md:grid-cols-2 gap-y-16 gap-x-20">
          <div className="flex items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full">
              <span className="text-lg font-semibold text-white">?</span>
            </div>
            <div className="ml-4">
              <p className="text-xl font-semibold text-white text-left">
                What types of corporate events do you specialize in managing?
              </p>
              <p className="mt-4 text-base text-gray-400 text-left">
                We specialize in managing a wide range of corporate events, with
                a focus on seminars and conferences. Our expertise extends to
                various business gatherings, ensuring each event is tailored to
                meet your specific needs and objectives.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full">
              <span className="text-lg font-semibold text-white">?</span>
            </div>
            <div className="ml-4">
              <p className="text-xl font-semibold text-white text-left">
                How much do your event planning services cost?
              </p>
              <p className="mt-4 text-base text-gray-400 text-left">
                Our pricing varies based on the specific requirements of your
                event and the package you choose. We offer flexible packages to
                accommodate different budgets. Please contact us for a
                customized quote based on your event details.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full">
              <span className="text-lg font-semibold text-white">?</span>
            </div>
            <div className="ml-4">
              <p className="text-xl font-semibold text-white text-left">
                What sets your event planning services apart from others?
              </p>
              <p className="mt-4 text-base text-gray-400 text-left">
                Our services stand out due to our commitment to precision
                planning, attention to detail, and a deep understanding of
                corporate dynamics. We bring a professional touch to every
                aspect of event management, ensuring a seamless and successful
                experience for our clients.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full">
              <span className="text-lg font-semibold text-white">?</span>
            </div>
            <div className="ml-4">
              <p className="text-xl font-semibold text-white text-left">
                Can I customize a package to fit my unique event needs?
              </p>
              <p className="mt-4 text-base text-gray-400 text-left">
                Absolutely! We understand that each event is unique. Our
                packages serve as a foundation, and we welcome customization to
                align with your specific requirements. Let us know your
                preferences, and we&apos;ll work together to create a
                tailor-made solution for your event.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-12 md:mt-20">
          <div className="px-8 py-4 text-center bg-gray-800 rounded-full">
            <p className="text-gray-50">
              Didn&apos;t find the answer you are looking for?{" "}
              <Link
                to="/contact"
                title=""
                className="text-yellow-300 transition-all duration-200 hover:text-yellow-400 focus:text-yellow-400 hover:underline"
              >
                Contact Us here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
