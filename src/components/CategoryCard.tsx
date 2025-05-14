
import React from 'react';
import { 
  ShoppingBag, 
  Salad, 
  Apple, 
  Coffee, 
  PanelTop, 
  Pill, 
  Beef, 
  Milk, 
  Snowflake 
} from 'lucide-react';

interface CategoryCardProps {
  category: string;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onClick }) => {
  // Function to get the appropriate icon based on category
  const getCategoryIcon = () => {
    switch (category) {
      case 'Personal Care':
        return <ShoppingBag size={24} />;
      case 'Food Items':
        return <PanelTop size={24} />;
      case 'Beverages':
        return <Coffee size={24} />;
      case 'Home Care':
        return <ShoppingBag size={24} />;
      case 'Health and Hygiene':
        return <Pill size={24} />;
      case 'Vegetables':
        return <Salad size={24} />;
      case 'Fruits':
        return <Apple size={24} />;
      case 'Meat':
        return <Beef size={24} />;
      case 'Dairy':
        return <Milk size={24} />;
      case 'Frozen':
        return <Snowflake size={24} />;
      case 'All Products':
        return <ShoppingBag size={24} />;
      default:
        return <ShoppingBag size={24} />;
    }
  };

  return (
    <div 
      className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all min-w-[100px] ${
        isSelected 
          ? 'bg-xstore-green text-white shadow-md' 
          : 'bg-white border border-gray-200 hover:border-xstore-green hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <div className={`mb-2 ${isSelected ? 'text-white' : 'text-xstore-green'}`}>
        {getCategoryIcon()}
      </div>
      <span className="text-sm font-medium text-center">{category}</span>
    </div>
  );
};

export default CategoryCard;
