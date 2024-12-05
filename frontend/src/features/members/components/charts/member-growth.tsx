'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', members: 1800 },
  { month: 'Fev', members: 1900 },
  { month: 'Mar', members: 1950 },
  { month: 'Abr', members: 2000 },
  { month: 'Mai', members: 2100 },
  { month: 'Jun', members: 2200 },
  { month: 'Jul', members: 2345 },
]

export function MemberGrowth() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Crescimento de Membros</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="members" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
