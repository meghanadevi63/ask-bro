import { VisualizationData, TableData } from '../types/visualization';

// Sample data for demonstration (in a real app, this would come from the API)
const sampleVisualizations: Record<string, VisualizationData[]> = {
  "revenue": [
    {
      type: 'line',
      title: 'Monthly Revenue Trend',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Revenue 2024',
          data: [65000, 72000, 80000, 87000, 92000, 98000, 105000, 110000, 118000, 125000, 132000, 145000],
        },
        {
          label: 'Revenue 2023',
          data: [60000, 65000, 70000, 75000, 85000, 90000, 95000, 100000, 110000, 115000, 120000, 130000],
        }
      ],
      description: 'Monthly revenue is trending upward with significant growth in Q4.'
    }
  ],
  "products": [
    {
      type: 'bar',
      title: 'Top 5 Selling Products (Q4)',
      labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
      datasets: [
        {
          label: 'Units Sold',
          data: [1234, 1100, 890, 750, 620],
        }
      ],
      description: 'Product A continues to be our top seller, with Product B showing strong growth.'
    }
  ],
  "regions": [
    {
      type: 'pie',
      title: 'Customer Distribution by Region',
      labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'],
      datasets: [
        {
          label: 'Customers',
          data: [45, 25, 15, 10, 5],
        }
      ],
      description: 'North America represents our largest customer base at 45%.'
    },
    {
      type: 'bar',
      title: 'Churn Rate by Region',
      labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'],
      datasets: [
        {
          label: 'Churn Rate (%)',
          data: [2.3, 3.1, 4.7, 3.8, 2.9],
        }
      ],
      description: 'Asia Pacific shows the highest churn rate at 4.7%, suggesting we need to investigate customer satisfaction issues in this region.'
    }
  ],
  "segments": [
    {
      type: 'radar',
      title: 'Performance Metrics by Customer Segment',
      labels: ['Revenue', 'Growth', 'Retention', 'Satisfaction', 'Engagement'],
      datasets: [
        {
          label: 'Enterprise',
          data: [90, 70, 85, 80, 75],
        },
        {
          label: 'SMB',
          data: [60, 85, 70, 75, 80],
        },
        {
          label: 'Consumer',
          data: [40, 60, 50, 90, 95],
        }
      ],
      description: 'Enterprise customers drive higher revenue but consumer segment shows better engagement and satisfaction.'
    }
  ],
  "marketing": [
    {
      type: 'scatter',
      title: 'Marketing Spend vs. Customer Acquisition',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Marketing ROI',
          data: [2.1, 2.3, 2.5, 2.7, 3.0, 3.2, 3.4, 3.5, 3.7, 3.8, 4.0, 4.2],
        }
      ],
      description: 'There is a strong positive correlation between increased marketing spend and new customer acquisition, with ROI improving throughout the year.'
    }
  ]
};

const sampleTables: Record<string, TableData> = {
  "revenue": {
    columns: ['Month', 'Revenue 2023', 'Revenue 2024', 'YoY Growth (%)'],
    rows: [
      ['January', '$60,000', '$65,000', '8.3%'],
      ['February', '$65,000', '$72,000', '10.8%'],
      ['March', '$70,000', '$80,000', '14.3%'],
      ['April', '$75,000', '$87,000', '16.0%'],
      ['May', '$85,000', '$92,000', '8.2%'],
      ['June', '$90,000', '$98,000', '8.9%'],
      ['July', '$95,000', '$105,000', '10.5%'],
      ['August', '$100,000', '$110,000', '10.0%'],
      ['September', '$110,000', '$118,000', '7.3%'],
      ['October', '$115,000', '$125,000', '8.7%'],
      ['November', '$120,000', '$132,000', '10.0%'],
      ['December', '$130,000', '$145,000', '11.5%']
    ],
    note: 'Data shows consistent year-over-year growth, with strongest performance in Q1 and Q4.'
  },
  "products": {
    columns: ['Rank', 'Product Name', 'Category', 'Units Sold', 'Revenue', 'Profit Margin'],
    rows: [
      ['1', 'Product A', 'Electronics', '1,234', '$432,900', '42%'],
      ['2', 'Product B', 'Home Goods', '1,100', '$385,000', '38%'],
      ['3', 'Product C', 'Electronics', '890', '$311,500', '45%'],
      ['4', 'Product D', 'Office', '750', '$262,500', '35%'],
      ['5', 'Product E', 'Clothing', '620', '$217,000', '48%']
    ]
  },
  "regions": {
    columns: ['Region', 'Customers', 'Revenue', 'Growth (%)', 'Churn Rate (%)'],
    rows: [
      ['North America', '45,000', '$5.8M', '12.4%', '2.3%'],
      ['Europe', '25,000', '$3.2M', '9.7%', '3.1%'],
      ['Asia Pacific', '15,000', '$1.9M', '15.6%', '4.7%'],
      ['Latin America', '10,000', '$1.3M', '8.5%', '3.8%'],
      ['Middle East', '5,000', '$0.7M', '7.2%', '2.9%']
    ]
  },
  "segments": {
    columns: ['Segment', 'Customer Count', 'Avg. Revenue', 'Growth (%)', 'Retention (%)', 'Satisfaction'],
    rows: [
      ['Enterprise', '250', '$125,000', '8.3%', '92%', '4.2/5'],
      ['SMB', '3,500', '$15,000', '15.7%', '85%', '4.0/5'],
      ['Consumer', '85,000', '$850', '6.2%', '75%', '4.5/5']
    ]
  },
  "marketing": {
    columns: ['Month', 'Marketing Spend', 'New Customers', 'CAC', 'ROI'],
    rows: [
      ['January', '$120,000', '580', '$207', '2.1'],
      ['February', '$125,000', '625', '$200', '2.3'],
      ['March', '$130,000', '680', '$191', '2.5'],
      ['April', '$135,000', '720', '$188', '2.7'],
      ['May', '$140,000', '770', '$182', '3.0'],
      ['June', '$145,000', '805', '$180', '3.2'],
      ['July', '$150,000', '850', '$176', '3.4'],
      ['August', '$155,000', '880', '$176', '3.5'],
      ['September', '$160,000', '925', '$173', '3.7'],
      ['October', '$165,000', '960', '$172', '3.8'],
      ['November', '$170,000', '1,020', '$167', '4.0'],
      ['December', '$175,000', '1,080', '$162', '4.2']
    ],
    note: 'Customer Acquisition Cost (CAC) has been decreasing while Return on Investment (ROI) has been improving, indicating more efficient marketing.'
  }
};

const sampleResponses: Record<string, string> = {
  "revenue": "Based on the data, our monthly revenue shows a strong upward trend throughout 2024. We've seen consistent year-over-year growth, with each month outperforming the same period last year. The strongest growth was in Q1, where March showed a 14.3% increase compared to 2023. The total revenue for 2024 so far is $1,229,000, which is 10.8% higher than the same period in 2023. The Q4 performance is particularly notable, with December showing the highest revenue of $145,000, representing an 11.5% increase from last year.",
  
  "products": "Looking at our top 5 selling products for Q4, Product A leads with 1,234 units sold, generating $432,900 in revenue. Product A belongs to the Electronics category and maintains a healthy profit margin of 42%. Product B follows with 1,100 units sold and $385,000 in revenue. Notably, our top-selling products span diverse categories including Electronics, Home Goods, Office supplies, and Clothing. The profit margins across these products range from 35% to 48%, with Product E (Clothing) showing the highest margin at 48%, despite being fifth in total units sold.",
  
  "regions": "The data shows that North America is our strongest region with 45,000 customers generating $5.8M in revenue, representing 45% of our customer base. Asia Pacific, while representing only 15% of our customer base (15,000 customers), shows the highest growth rate at 15.6%. However, it also has the highest churn rate at 4.7%, suggesting customer retention issues that need addressing. Europe is our second largest market with 25,000 customers and $3.2M in revenue. The Middle East, though our smallest region with 5,000 customers, has a relatively low churn rate at 2.9%, indicating good customer satisfaction.",
  
  "segments": "Our customer segmentation analysis reveals distinct patterns across Enterprise, SMB, and Consumer segments. The Enterprise segment, though smallest in customer count (250), generates the highest average revenue per customer at $125,000. SMBs show the strongest growth at 15.7%, making them our fastest-growing segment. Consumer customers, while generating the lowest average revenue ($850), show the highest satisfaction scores (4.5/5) and represent our largest customer base by volume (85,000 customers). Enterprise customers have the best retention rate at 92%, suggesting strong product-market fit for this segment.",
  
  "marketing": "Our marketing analysis shows a clear positive correlation between marketing spend and new customer acquisition. As we increased our monthly marketing budget from $120,000 in January to $175,000 in December, we observed a corresponding increase in new customer acquisition from 580 to 1,080 customers per month. More importantly, our Customer Acquisition Cost (CAC) has decreased from $207 to $162, indicating improved marketing efficiency. The Return on Investment (ROI) has steadily increased from 2.1 in January to 4.2 in December, representing a 100% improvement in marketing effectiveness throughout the year."
};

const sampleSQL: Record<string, string> = {
  "revenue": `
SELECT 
  date_trunc('month', order_date) AS month,
  SUM(order_total) AS monthly_revenue
FROM orders
WHERE order_date BETWEEN '2023-01-01' AND '2024-12-31'
GROUP BY month
ORDER BY month ASC;`,
  
  "products": `
SELECT 
  p.product_name,
  c.category_name,
  COUNT(oi.order_id) AS units_sold,
  SUM(oi.quantity * oi.unit_price) AS revenue,
  AVG(p.profit_margin) AS profit_margin
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN categories c ON p.category_id = c.id
WHERE oi.order_date BETWEEN '2024-10-01' AND '2024-12-31'
GROUP BY p.product_name, c.category_name
ORDER BY units_sold DESC
LIMIT 5;`,
  
  "regions": `
WITH region_metrics AS (
  SELECT 
    r.region_name,
    COUNT(DISTINCT c.id) AS customer_count,
    SUM(o.order_total) AS revenue,
    100 * (SUM(CASE WHEN o.order_date >= '2024-01-01' THEN o.order_total ELSE 0 END) / 
    NULLIF(SUM(CASE WHEN o.order_date BETWEEN '2023-01-01' AND '2023-12-31' THEN o.order_total ELSE 0 END), 0) - 1) AS growth_pct,
    100 * (COUNT(DISTINCT CASE WHEN c.status = 'churned' AND c.churn_date >= '2024-01-01' THEN c.id END) / 
    NULLIF(COUNT(DISTINCT c.id), 0)) AS churn_rate
  FROM regions r
  JOIN customers c ON c.region_id = r.id
  LEFT JOIN orders o ON o.customer_id = c.id
  GROUP BY r.region_name
)
SELECT * FROM region_metrics
ORDER BY customer_count DESC;`,
  
  "segments": `
SELECT 
  cs.segment_name,
  COUNT(c.id) AS customer_count,
  AVG(c.annual_revenue) AS avg_revenue,
  100 * (COUNT(DISTINCT CASE WHEN c.created_at >= '2024-01-01' THEN c.id END) / 
  NULLIF(COUNT(DISTINCT CASE WHEN c.created_at BETWEEN '2023-01-01' AND '2023-12-31' THEN c.id END), 0) - 1) AS growth_pct,
  100 * (COUNT(DISTINCT CASE WHEN c.status = 'active' AND c.created_at < '2023-01-01' THEN c.id END) / 
  NULLIF(COUNT(DISTINCT CASE WHEN c.created_at < '2023-01-01' THEN c.id END), 0)) AS retention_pct,
  AVG(cs.satisfaction_score) AS satisfaction
FROM customer_segments cs
JOIN customers c ON c.segment_id = cs.id
GROUP BY cs.segment_name;`,
  
  "marketing": `
SELECT 
  date_trunc('month', m.campaign_date) AS month,
  SUM(m.spend) AS marketing_spend,
  COUNT(DISTINCT c.id) AS new_customers,
  SUM(m.spend) / NULLIF(COUNT(DISTINCT c.id), 0) AS cac,
  SUM(o.order_total) / NULLIF(SUM(m.spend), 0) AS roi
FROM marketing_campaigns m
JOIN customers c ON c.acquisition_campaign_id = m.id
JOIN orders o ON o.customer_id = c.id AND o.order_date <= date_add('month', 3, c.created_at)
WHERE m.campaign_date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY month
ORDER BY month ASC;`
};

// Function to detect the topic based on keywords in the query
const detectTopic = (query: string): string => {
  query = query.toLowerCase();
  
  if (query.includes('revenue') || query.includes('sales') || query.includes('income') || query.includes('trend')) {
    return 'revenue';
  }
  
  if (query.includes('product') || query.includes('selling') || query.includes('top 5')) {
    return 'products';
  }
  
  if (query.includes('region') || query.includes('churn') || query.includes('geographic')) {
    return 'regions';
  }
  
  if (query.includes('segment') || query.includes('enterprise') || query.includes('smb') || query.includes('consumer')) {
    return 'segments';
  }
  
  if (query.includes('marketing') || query.includes('acquisition') || query.includes('cac') || query.includes('spend')) {
    return 'marketing';
  }
  
  // Default to revenue if no match
  return 'revenue';
};

interface ResponseData {
  content: string;
  visualizations?: VisualizationData[];
  data?: TableData;
  sql?: string;
}

// Demo function to generate response based on user query
// In a real application, this would call the backend API
export const generateResponse = async (
  query: string,
): Promise<ResponseData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const topic = detectTopic(query);
  
  // In a real application, we would call the backend here:
  // const response = await fetch('/api/chat', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ query, history: previousMessages })
  // });
  // const data = await response.json();
  // return data;
  
  // For demo purposes, return canned responses
  return {
    content: sampleResponses[topic],
    visualizations: sampleVisualizations[topic],
    data: sampleTables[topic],
    sql: sampleSQL[topic]
  };
};