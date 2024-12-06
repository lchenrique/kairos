import { useState } from "react"
import { motion } from "framer-motion"
import React from "react"

interface GridWithPaginationProps<T> {
  data: T[]
  renderItem?: (item: T, index: number) => React.ReactNode

}

export function GridWithPagination<T>({ 
  data, 
  renderItem,
}: GridWithPaginationProps<T>) {
  return (
    <div className="space-y-6">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.1,
              staggerChildren: 0.05
            }
          }
        }}
      >
        {data.map((item, index) => {
          const renderedContent = typeof renderItem === 'function' 
            ? renderItem(item, index) 
            : null

          return renderedContent ? (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.1 + (index * 0.05)
                  }
                }
              }}
            >
              {renderedContent}
            </motion.div>
          ) : null
        })}
      </motion.div>
    </div>
  )
}
