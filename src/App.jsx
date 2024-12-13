import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

// Fetch product data
async function fetchProduct() {
  return await axios.get("http://localhost:8080/products");
}

function App() {
  const { data } = useQuery("product", fetchProduct);

  const [isOpenCustomizeModal, setIsOpenCustomizeModal] = useState(false);
  const [activeStyle, setActiveStyle] = useState({
    neckline: "",
    sleeveR: "",
    sleeveL: "",
    length: "",
  });

  function handleChangeStyle(id) {
    const propertyToChange = id.split("-")[0];
    console.log(propertyToChange);
    console.log(id);

    console.log(
      "url",
      data.data[0]?.[`${propertyToChange}Templates`].find(
        (template) => template.id === id
      )?.resultUrl
    );

    setActiveStyle({
      ...activeStyle,
      [propertyToChange]: data.data[0]?.[`${propertyToChange}Templates`].find(
        (template) => template.id === id
      )?.resultUrl,
    });
  }

  // UseEffect to update state after data fetch
  useEffect(() => {
    if (data?.data?.[0]) {
      setActiveStyle({
        neckline: data.data[0]?.necklineTemplates?.[0]?.resultUrl || "",
        sleeveR: data.data[0]?.sleeveTemplates?.[0]?.resultUrlR || "",
        sleeveL: data.data[0]?.sleeveTemplates?.[0]?.resultUrlL || "",
        length: data.data[0]?.lengthTemplates?.[0]?.resultUrl || "",
      });
    }
  }, [data]);

  console.log(activeStyle);

  // Open modal
  const handleOpenCustomizeModal = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpenCustomizeModal(true);
  };

  // Close modal
  const handleCloseCustomizeModal = () => {
    setIsOpenCustomizeModal(false);
  };

  console.log(data?.data);
  return (
    <section
      className="max-w-6xl mx-auto flex justify-start gap-32 items-start py-32"
      onClick={handleCloseCustomizeModal}
    >
      {/* Product content */}
      <div className={`${isOpenCustomizeModal ? "opacity-40" : "opacity-100"}`}>
        <div>
          <img src={data?.data[0]?.mainImage} alt="" />
        </div>
      </div>

      {/* Product Details */}
      <div>
        <h2>{data?.data[0]?.title}</h2>
        <p>{data?.data[0]?.price}</p>
        <button
          className="p-10 bg-gray-200 border"
          onClick={handleOpenCustomizeModal}
        >
          Customize style
        </button>
      </div>

      {/* Modal */}
      {isOpenCustomizeModal && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10 flex justify-center items-center"
          onClick={handleCloseCustomizeModal} // Close when clicking outside modal content
        >
          <div
            className="p-10 bg-white shadow-lg  w-11/12 flex flex-col md:flex-row justify-start items-stretch "
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* model image  */}
            <div className="">
              <div className="relative w-[376.8px] h-[560px] mx-auto">
                <div className="flex">
                  {/* nickline */}
                  <div className=" absolute w-[68.8px] h-[280px] left-[160px] top-0">
                    <img src={activeStyle.neckline} className="h-full w-full" />
                  </div>
                  {/* sleeve right  */}
                  <div className="absolute w-[148] h-[280px] left-[228.8px] top-0">
                    <img src={activeStyle.sleeveR} className="h-full w-full" />
                  </div>

                  {/* sleeve left  */}
                  <div className=" absolute w-[160px] h-[280px] left-0 top-0">
                    <img src={activeStyle.sleeveL} className="h-full w-full" />
                  </div>
                </div>
                {/* length  */}
                <div className="absolute w-[376.8px] h-[280px] top-[279.2px] left-0">
                  <img src={activeStyle.length} className="h-full w-full" />
                </div>
              </div>
            </div>

            {/* right container  */}
            <div className="p-10 flex flex-col gap-20">
              {/* Neckline templates  */}
              <div className="flex flex-col gap-2">
                <p>Click to change Neckline</p>
                <div className="flex items-center gap-4">
                  {data?.data[0].necklineTemplates?.map((necklineTemplate) => {
                    return (
                      <div
                        key={necklineTemplate.id}
                        className="h-12 w-12 cursor-pointer"
                      >
                        {!necklineTemplate.templateUrl ? (
                          <p className="h-12 w-12 cursor-pointer bg-gray-100 text-xs flex justify-center items-center mr-24 ">
                            Default
                          </p>
                        ) : (
                          <div>
                            <img
                              src={necklineTemplate.templateUrl}
                              className="h-full w-full first:ml-6"
                              onClick={() =>
                                handleChangeStyle(necklineTemplate.id)
                              }
                            />
                            <p className="text-[0.5rem] text-center  ml-6 ">
                              {necklineTemplate?.title}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Sleeve templates  */}
              <div className="flex flex-col gap-2">
                <p>Click to change Sleeve Type</p>
                <div className="flex items-center gap-4">
                  {data?.data[0].sleeveTemplates?.map((sleeveTemplate) => {
                    return (
                      <div
                        key={sleeveTemplate.id}
                        className="h-12 w-12 cursor-pointer"
                      >
                        {!sleeveTemplate.templateUrl ? (
                          <p className="h-12 w-12  cursor-pointer bg-gray-100 text-xs flex justify-center items-center">
                            Default
                          </p>
                        ) : (
                          <div>
                            <img
                              src={sleeveTemplate.templateUrl}
                              className="h-full w-full first:ml-6"
                              onClick={() =>
                                handleChangeStyle(sleeveTemplate.id)
                              }
                            />
                            <p className="text-[0.5rem] text-center  ml-6 ">
                              {sleeveTemplate?.title}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* length templates  */}
              <div className="flex flex-col gap-2">
                <p>Click to change Length</p>
                <div className="flex items-center gap-4">
                  {data?.data[0].lengthTemplates?.map((lengthTemplate) => {
                    return (
                      <div
                        key={lengthTemplate.id}
                        className="h-12 w-12 cursor-pointer"
                      >
                        {!lengthTemplate.templateUrl ? (
                          <p className="h-12 w-12 cursor-pointer bg-gray-100 text-xs flex justify-center items-center">
                            Default
                          </p>
                        ) : (
                          <div>
                            <img
                              src={lengthTemplate?.templateUrl}
                              className="h-full w-full first:ml-6"
                              onClick={() =>
                                handleChangeStyle(lengthTemplate.id)
                              }
                            />
                            <p className="text-[0.5rem] ml-6 ">
                              {lengthTemplate?.title}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
