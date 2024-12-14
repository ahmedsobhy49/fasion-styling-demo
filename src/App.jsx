import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

// Fetch product data
async function fetchProduct() {
  return await axios.get("http://localhost:8080/products");
}

function App() {
  const { data } = useQuery("product", fetchProduct);

  // state to track whether customize modal is open or not
  const [isOpenCustomizeModal, setIsOpenCustomizeModal] = useState(false);

  // state to track which style is active
  const [activeStyle, setActiveStyle] = useState({
    neckline: "",
    sleeve: {
      resultUrlR: "",
      resultUrlL: "",
    },
    length: "",
  });

  // state to track which tamplate is active
  const [activeTemplateIds, setActiveTemplateIds] = useState({
    neckline: "",
    sleeve: "",
    length: "",
  });

  const [changingPart, setChangingPart] = useState(null); // Track which part is changing
  const [currentStyle, setCurrentStyle] = useState({}); // Store current styles
  const [nextStyle, setNextStyle] = useState({}); // Store next styles

  // Function to handle the change style (like `neckline`, `sleeve`, etc.)
  function handleChangeStyle(id) {
    const propertyToChange = id.split("-")[0];
    setChangingPart(propertyToChange);

    const nextTemplate = data.data[0]?.[`${propertyToChange}Templates`]?.find(
      (template) => template.id === id
    );

    if (propertyToChange === "sleeve") {
      // Handle sleeve's specific structure
      setNextStyle((prev) => ({
        ...prev,
        sleeve: {
          resultUrlR: nextTemplate?.resultUrl?.resultUrlR || "",
          resultUrlL: nextTemplate?.resultUrl?.resultUrlL || "",
        },
      }));
    } else {
      // Handle other parts like neckline and length
      setNextStyle((prev) => ({
        ...prev,
        [propertyToChange]: nextTemplate?.resultUrl || "",
      }));
    }

    setTimeout(() => {
      setCurrentStyle((prev) => ({
        ...prev,
        [propertyToChange]:
          propertyToChange === "sleeve"
            ? {
                resultUrlR: nextTemplate?.resultUrl?.resultUrlR || "",
                resultUrlL: nextTemplate?.resultUrl?.resultUrlL || "",
              }
            : nextTemplate?.resultUrl || "",
      }));
      setChangingPart(null);
    }, 200);
  }

  // UseEffect to update state after data fetch
  useEffect(() => {
    if (data?.data?.[0]) {
      const product = data.data[0];
      setActiveStyle({
        neckline: product?.necklineTemplates?.[0]?.resultUrl || "",
        sleeve: {
          resultUrlR: product.sleeveTemplates?.[0]?.resultUrl?.resultUrlR || "",
          resultUrlL: product.sleeveTemplates?.[0]?.resultUrl?.resultUrlL || "",
        },
        length: product.lengthTemplates?.[0]?.resultUrl || "",
      });

      setActiveTemplateIds({
        neckline: product?.necklineTemplates?.[0]?.id || "",
        sleeve: product?.sleeveTemplates?.[0]?.id || "",
        length: product?.lengthTemplates?.[0]?.id || "",
      });
    }
  }, [data]);

  // Open modal
  const handleOpenCustomizeModal = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpenCustomizeModal(true);
  };

  // Close modal
  const handleCloseCustomizeModal = () => {
    setIsOpenCustomizeModal(false);
  };

  return (
    <section
      className="max-w-6xl mx-auto flex justify-start gap-32 items-start py-32 text-gray-500"
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
                <div className="flex h-full w-full">
                  {/* nickline */}
                  <div className=" absolute w-[68.8px] h-[280px] left-[160px] top-0">
                    <div className="w-full h-full relative">
                      <img
                        src={currentStyle.neckline || activeStyle.neckline} // Fallback to activeStyle if currentStyle is empty
                        className={`h-full w-full absolute z-10 ${
                          changingPart === "neckline" ? "fade-out" : ""
                        }`}
                      />
                      <img
                        src={nextStyle.neckline}
                        className={`h-full w-full absolute  ${
                          changingPart === "neckline" ? "fade-in" : ""
                        }`}
                      />
                    </div>
                  </div>
                  {/* sleeve right  */}
                  <div className="absolute w-[148px] h-[280px] left-[228.8px] top-0">
                    <div className="w-full h-full relative">
                      <img
                        src={
                          currentStyle?.sleeve?.resultUrlR ||
                          activeStyle.sleeve.resultUrlR
                        } // Fallback to activeStyle if currentStyle is empty
                        className={`h-full w-full absolute z-10 ${
                          changingPart === "sleeve" ? "fade-out" : ""
                        }`}
                      />
                      <img
                        src={nextStyle?.sleeve?.resultUrlR}
                        className={`h-full w-full absolute  ${
                          changingPart === "sleeve" ? "fade-in" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* sleeve left  */}
                  <div className=" absolute w-[160px] h-[280px] left-0 top-0">
                    <div className="w-full h-full relative">
                      <img
                        src={
                          currentStyle?.sleeve?.resultUrlL ||
                          activeStyle.sleeve.resultUrlL
                        } // Fallback to activeStyle if currentStyle is empty
                        className={`h-full w-full absolute z-10 ${
                          changingPart === "sleeve" ? "fade-out" : ""
                        }`}
                      />
                      <img
                        src={nextStyle?.sleeve?.resultUrlL}
                        className={`h-full w-full absolute ${
                          changingPart === "sleeve" ? "fade-in" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
                {/* length  */}
                <div className="absolute  w-[376.8px] h-[280px] top-[279.2px] left-0 ">
                  <div className="w-full h-full relative">
                    <img
                      src={currentStyle.length || activeStyle.length} // Fallback to activeStyle if currentStyle is empty
                      className={`h-full w-full absolute z-10 ${
                        changingPart === "length" ? "fade-out" : ""
                      }`}
                    />
                    <img
                      src={nextStyle.length}
                      className={`h-full w-full absolute ${
                        changingPart === "length" ? "fade-in" : ""
                      }`}
                    />
                  </div>
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
                    const isActive =
                      activeTemplateIds.neckline === necklineTemplate.id;
                    return (
                      <div
                        key={necklineTemplate.id}
                        className="h-12 w-12 cursor-pointer"
                      >
                        {!necklineTemplate.templateUrl ? (
                          <p
                            className={`h-[50px] w-[50px] cursor-pointer bg-gray-100 text-xs flex justify-center items-center border  p-[.1rem] ${
                              isActive
                                ? "border-green-100"
                                : "border-transparent"
                            }`}
                            onClick={() =>
                              handleChangeStyle(necklineTemplate.id)
                            }
                          >
                            Default
                          </p>
                        ) : (
                          <div
                            className={` w-[50px] h-[50px] first:ml-6 border  p-[.1rem] ${
                              isActive
                                ? " border-green-200"
                                : "border-transparent"
                            }`}
                          >
                            <img
                              src={necklineTemplate?.templateUrl}
                              className="h-full w-full  "
                              onClick={() =>
                                handleChangeStyle(necklineTemplate.id)
                              }
                            />
                            <p className="text-[0.5rem] text-center">
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
                    const isActive =
                      activeTemplateIds.sleeve === sleeveTemplate.id;
                    return (
                      <div
                        key={sleeveTemplate.id}
                        className="h-12 w-12 cursor-pointer"
                      >
                        {!sleeveTemplate.templateUrl ? (
                          <p
                            className={`h-[50px] w-[50px] cursor-pointer bg-gray-100 text-xs flex justify-center items-center border  p-[.1rem] ${
                              isActive
                                ? "border-green-100"
                                : "border-transparent"
                            }`}
                            onClick={() => handleChangeStyle(sleeveTemplate.id)}
                          >
                            Default
                          </p>
                        ) : (
                          <div
                            className={` w-[50px] h-[50px] first:ml-6 border p-[.1rem] ${
                              isActive
                                ? " border-green-200"
                                : "border-transparent"
                            }`}
                          >
                            <img
                              src={sleeveTemplate?.templateUrl}
                              className="h-full w-full  "
                              onClick={() =>
                                handleChangeStyle(sleeveTemplate.id)
                              }
                            />
                            <p className="text-[0.5rem] text-center">
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
                    const isActive =
                      activeTemplateIds.length === lengthTemplate.id;
                    return (
                      <div
                        key={lengthTemplate.id}
                        className={`h-12 w-12 cursor-pointer`}
                      >
                        {!lengthTemplate.templateUrl ? (
                          <p
                            className={`h-[50px] w-[50px] cursor-pointer bg-gray-100 text-xs flex justify-center items-center border  p-[.1rem] ${
                              isActive
                                ? "border-green-100"
                                : "border-transparent"
                            }`}
                            onClick={() => handleChangeStyle(lengthTemplate.id)}
                          >
                            Default
                          </p>
                        ) : (
                          <div
                            className={` w-[50px] h-[50px] first:ml-6 border  p-[.1rem] ${
                              isActive
                                ? " border-green-200"
                                : "border-transparent"
                            }`}
                          >
                            <img
                              src={lengthTemplate?.templateUrl}
                              className="h-full w-full  "
                              onClick={() =>
                                handleChangeStyle(lengthTemplate.id)
                              }
                            />
                            <p className="text-[0.5rem] text-center">
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
