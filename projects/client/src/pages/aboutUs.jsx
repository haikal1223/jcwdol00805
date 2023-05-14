import React from "react";
import { Text } from "@chakra-ui/react";

const AboutUs = () => {
  return (
    <div className="flex flex-col my-5">
      <Text
        align={["center"]}
        w="full"
        pt="30px"
        px="30px"
        className="font-ibmFont"
        fontSize={48}
        fontWeight={700}
        mb={4}
      >
        About Us
      </Text>
      <Text mb={4} textAlign={"center"}>
        At JakartaThreads, we understand that being a modern parent is not an easy
        task. We know that you want to provide your kids with the best of
        everything, including stylish and trendy clothing that makes them feel
        confident and comfortable. That's why we created a fashion destination
        that caters to the needs of urban families like yours.
      </Text>
      <Text mb={4} textAlign={"center"}>
        Based in Jakarta, Indonesia, our small team of passionate individuals is
        dedicated to providing a hassle-free shopping experience with a
        customer-centric approach. We believe that shopping for your little ones
        should be effortless and enjoyable, which is why we've created a
        platform that offers a unique and curated collection of clothing items
        for children aged 6-12.
      </Text>
      <Text mb={4} textAlign={"center"}>
        Our collection includes fashionable clothing items from well-known
        brands such as Nike and Adidas. We understand that you want to dress
        your kids in stylish clothes without breaking the bank, which is why we
        offer competitive prices without compromising on quality.
      </Text>
      <Text mb={4} textAlign={"center"}>
        At JakartaThreads, we're not just about selling clothes; we're about inspiring
        confidence in children and helping urban families express their unique
        sense of style. We take pride in offering top-quality products,
        exceptional customer service, and a personalized shopping experience
        that caters to your needs.
      </Text>
      <Text mb={4} textAlign={"center"}>
        Thank you for choosing JakartaThreads as your fashion destination. We are
        excited to be a part of your family's fashion journey and look forward
        to helping you find the perfect outfits for your little ones.
      </Text>
    </div>
  );
};

export default AboutUs;
