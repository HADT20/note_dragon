import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface FeatureBoxProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

export default function FeatureBox({ icon: Icon, title, description, href }: FeatureBoxProps) {
  return (
    <Link href={href}>
      <div className="bg-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-6 hover:bg-blue-600/30 transition-all duration-300 cursor-pointer group">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center group-hover:bg-blue-500/50 transition-colors">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-100 transition-colors">
              {title}
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
