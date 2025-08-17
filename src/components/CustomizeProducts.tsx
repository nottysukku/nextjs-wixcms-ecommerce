"use client";

import { products } from "@wix/stores";
import { useEffect, useState } from "react";
import Add from "./Add";

const CustomizeProducts = ({
  productId,
  variants,
  productOptions,
}: {
  productId: string;
  variants: products.Variant[];
  productOptions: products.ProductOption[];
}) => {
  // Initialize selectedOptions with first choice of each product option
  const getInitialSelectedOptions = () => {
    console.log("getInitialSelectedOptions called with productOptions:", productOptions);
    const initialOptions: { [key: string]: string } = {};
    productOptions.forEach(option => {
      console.log("Processing option:", option);
      if (option.choices && option.choices.length > 0) {
        initialOptions[option.name!] = option.choices[0].description!;
        console.log(`Added ${option.name}: ${option.choices[0].description}`);
      }
    });
    console.log("Final initial options:", initialOptions);
    return initialOptions;
  };

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>(getInitialSelectedOptions());
  
  const [selectedVariant, setSelectedVariant] = useState<products.Variant>();

  console.log("CustomizeProducts rendered with:", {
    productId,
    variants: variants.length,
    productOptions: productOptions.length,
    currentSelectedOptions: selectedOptions,
    initialOptions: getInitialSelectedOptions()
  });

    // Find matching variant when selectedOptions change
  useEffect(() => {
    console.log("Variant matching effect - selectedOptions:", selectedOptions);
    
    if (variants.length > 0 && Object.keys(selectedOptions).length > 0) {
      console.log("Looking for matching variant...");
      const variant = variants.find((v) => {
        const variantChoices = v.choices;
        if (!variantChoices) {
          console.log("Variant has no choices, using first variant");
          return true; // Use first variant if no choices
        }

        return Object.entries(selectedOptions).every(
          ([key, value]) => {
            const match = variantChoices[key] === value;
            console.log(`Matching ${key}: ${value} === ${variantChoices[key]} = ${match}`);
            return match;
          }
        );
      });
      
      console.log("Selected variant:", variant);
      setSelectedVariant(variant || variants[0]); // Fallback to first variant
    } else {
      console.log("No variants or no selected options, using first variant");
      setSelectedVariant(variants[0]);
    }
  }, [selectedOptions, variants]);

  useEffect(() => {
    // Find matching variant based on selected options
    const variant = variants.find((v) => {
      const variantChoices = v.choices;
      if (!variantChoices) return false;
      
      // If variant has choices, match them with selected options
      if (Object.keys(variantChoices).length > 0) {
        const matches = Object.entries(selectedOptions).every(
          ([key, value]) => variantChoices[key] === value
        );
        return matches;
      }
      
      return false;
    });
    
    // If no variant found with matching choices, use the first variant (default)
    // This handles cases where product has options but variants don't have proper choices
    const selectedVariantResult = variant || (variants.length > 0 ? variants[0] : undefined);
    
    console.log("Selected variant:", selectedVariantResult?._id, "with options:", selectedOptions);
    console.log("All variants:", variants.map(v => ({ id: v._id, choices: v.choices })));
    setSelectedVariant(selectedVariantResult);
  }, [selectedOptions, variants]);

  const handleOptionSelect = (optionType: string, choice: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionType]: choice }));
  };

  const isVariantInStock = (choices: { [key: string]: string }) => {
    // Find variant that matches the given choices
    const matchingVariant = variants.find((variant) => {
      const variantChoices = variant.choices;
      if (!variantChoices) return false;

      // If variant has choices, match them
      if (Object.keys(variantChoices).length > 0) {
        const matchesChoices = Object.entries(choices).every(
          ([key, value]) => variantChoices[key] === value
        );
        return matchesChoices;
      }
      
      return false;
    });

    // If no specific variant found, use the first variant (this handles products with options but no variant choices)
    const variantToCheck = matchingVariant || variants[0];
    
    if (!variantToCheck) return false;

    // Check stock status - be more flexible with stock checking
    // If inStock is explicitly false, then it's out of stock
    if (variantToCheck.stock?.inStock === false) return false;
    
    // If quantity is explicitly 0, then it's out of stock
    if (variantToCheck.stock?.quantity === 0) return false;
    
    // If we have a positive quantity, it's in stock
    if (variantToCheck.stock?.quantity && variantToCheck.stock.quantity > 0) return true;
    
    // If inStock is true or undefined/null, assume it's in stock (default behavior)
    return variantToCheck.stock?.inStock === true || variantToCheck.stock?.inStock === undefined;
  };

  return (
    <div className="flex flex-col gap-6">
      {productOptions.map((option) => (
        <div className="flex flex-col gap-4" key={option.name}>
          <h4 className="font-medium">Choose a {option.name}</h4>
          <ul className="flex items-center gap-3">
            {option.choices?.map((choice) => {
              const disabled = !isVariantInStock({
                ...selectedOptions,
                [option.name!]: choice.description!,
              });

              const selected =
                selectedOptions[option.name!] === choice.description;

              const clickHandler = disabled
                ? undefined
                : () => handleOptionSelect(option.name!, choice.description!);

              return option.name === "Color" ? (
                <li
                  className="w-8 h-8 rounded-full ring-1 ring-gray-300 relative"
                  style={{
                    backgroundColor: choice.value,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                  onClick={clickHandler}
                  key={choice.description}
                >
                  {selected && (
                    <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                  {disabled && (
                    <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </li>
              ) : (
                <li
                  className="ring-1 ring-sukku text-sukku rounded-md py-1 px-4 text-sm"
                  style={{
                    cursor: disabled ? "not-allowed" : "pointer",
                    backgroundColor: selected
                      ? "#f35c7a"
                      : disabled
                      ? "#FBCFE8"
                      : "white",
                    color: selected || disabled ? "white" : "#f35c7a",
                    boxShadow: disabled ? "none" : "",
                    
                  }}
                  key={choice.description}
                  onClick={clickHandler}
                >
                  {choice.description}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      
      {/* Check if productOptions exist but have no choices - show fallback message */}
      {productOptions.length > 0 && productOptions.every(option => !option.choices || option.choices.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-700">
            This product has size options but they are not properly configured in the system. 
            You can still add it to cart with the default configuration.
          </p>
        </div>
      )}

      <Add
        productId={productId}
        variantId={
          selectedVariant?._id || variants[0]?._id || "00000000-0000-0000-0000-000000000000"
        }
        selectedOptions={selectedOptions}
        stockNumber={
          selectedVariant ? (
            // If we have a selected variant, use its stock info
            selectedVariant.stock?.quantity ?? 
            (selectedVariant.stock?.inStock !== false ? 999 : 0)
          ) : variants[0] ? (
            // Fallback to first variant if no variant selected but variants exist
            variants[0].stock?.quantity ?? 
            (variants[0].stock?.inStock !== false ? 999 : 0)
          ) : (
            // No variants available
            0
          )
        }
      />
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mt-2">
          <div>Selected Variant: {selectedVariant?._id || 'None'}</div>
          <div>Selected Options: {JSON.stringify(selectedOptions)}</div>
          <div>Available Variants: {variants.length}</div>
          <div>Product Options: {productOptions.length}</div>
          <div>First Variant ID: {variants[0]?._id || 'None'}</div>
        </div>
      )}
      {/* COLOR */}
      {/* 
          <ul className="flex items-center gap-3">
            <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-red-500">
              <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </li>
            <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-pointer relative bg-blue-500"></li>
            <li className="w-8 h-8 rounded-full ring-1 ring-gray-300 cursor-not-allowed relative bg-green-500">
              <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </li>
          </ul> */}
      {/* OTHERS */}
      {/* <h4 className="font-medium">Choose a size</h4>
      <ul className="flex items-center gap-3">
        <li className="ring-1 ring-sukku text-sukku rounded-md py-1 px-4 text-sm cursor-pointer">
          Small
        </li>
        <li className="ring-1 ring-sukku text-white bg-sukku rounded-md py-1 px-4 text-sm cursor-pointer">
          Medium
        </li>
        <li className="ring-1 ring-pink-200 text-white bg-pink-200 rounded-md py-1 px-4 text-sm cursor-not-allowed">
          Large
        </li>
      </ul> */}
    </div>
  );
};

export default CustomizeProducts;
