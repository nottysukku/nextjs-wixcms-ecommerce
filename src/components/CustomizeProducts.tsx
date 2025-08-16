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
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [selectedVariant, setSelectedVariant] = useState<products.Variant>();

  // Initialize with first available variant if none selected
  useEffect(() => {
    if (Object.keys(selectedOptions).length === 0 && variants.length > 0) {
      // Check if we have actual variant choices or just default variant
      const variantWithChoices = variants.find(variant => {
        return variant.choices && Object.keys(variant.choices).length > 0;
      });

      if (variantWithChoices && variantWithChoices.choices) {
        console.log("Auto-selecting first variant with choices:", variantWithChoices);
        setSelectedOptions(variantWithChoices.choices);
      } else {
        // No variants have actual choices, but product has options - this is a configuration issue
        // For now, we'll use the default variant
        console.log("Product has productOptions but variants don't have choices. Using default variant.");
        const defaultVariant = variants[0];
        if (defaultVariant) {
          setSelectedVariant(defaultVariant);
        }
      }
    }
  }, [variants]);

  useEffect(() => {
    const variant = variants.find((v) => {
      const variantChoices = v.choices;
      if (!variantChoices) return false;
      
      const matches = Object.entries(selectedOptions).every(
        ([key, value]) => variantChoices[key] === value
      );
      
      return matches;
    });
    
    console.log("Selected variant:", variant?._id, "with options:", selectedOptions);
    setSelectedVariant(variant);
  }, [selectedOptions, variants]);

  const handleOptionSelect = (optionType: string, choice: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionType]: choice }));
  };

  const isVariantInStock = (choices: { [key: string]: string }) => {
    return variants.some((variant) => {
      const variantChoices = variant.choices;
      if (!variantChoices) return false;

      const matchesChoices = Object.entries(choices).every(
        ([key, value]) => variantChoices[key] === value
      );

      if (!matchesChoices) return false;

      // Check stock status - be more flexible with stock checking
      // If inStock is explicitly false, then it's out of stock
      if (variant.stock?.inStock === false) return false;
      
      // If quantity is explicitly 0, then it's out of stock
      if (variant.stock?.quantity === 0) return false;
      
      // If we have a positive quantity, it's in stock
      if (variant.stock?.quantity && variant.stock.quantity > 0) return true;
      
      // If inStock is true or undefined/null, assume it's in stock (default behavior)
      return variant.stock?.inStock === true || variant.stock?.inStock === undefined;
    });
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
