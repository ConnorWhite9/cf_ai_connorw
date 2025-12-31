const SectionHeader = ({ icon: Icon, title, color }: any) => (
  <h2 className="text-xl font-semibold text-emerald-100 mb-4 flex items-center gap-2" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
    <Icon className={`w-5 h-5 ${color}`} />
    {title}
  </h2>
);


export default SectionHeader;