"use client";
import React, { FC, useRef } from "react";
import { motion, useInView } from "framer-motion";

const Card: FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      className="bg-white px-6 py-6 rounded-lg shadow-lg flex flex-col items-center gap-2 text-center space-y-4"
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="p-4 bg-light-blue-100 rounded-full mt-4">
        <div className="text-blue-500">{icon}</div>
      </div>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="text-gray-700 leading-7">{description}</p>
    </motion.div>
  );
};

export default Card;
