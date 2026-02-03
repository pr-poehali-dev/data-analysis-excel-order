import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

const forecastData = [
  { month: 'Янв', actual: 4200, forecast: 4000, order: 3800 },
  { month: 'Фев', actual: 3800, forecast: 3900, order: 3700 },
  { month: 'Мар', actual: 4500, forecast: 4300, order: 4100 },
  { month: 'Апр', actual: 4800, forecast: 4700, order: 4500 },
  { month: 'Май', actual: 5200, forecast: 5100, order: 4900 },
  { month: 'Июн', actual: null, forecast: 5400, order: 5200 },
  { month: 'Июл', actual: null, forecast: 5600, order: 5400 },
];

const categoryData = [
  { name: 'Электроника', value: 8500, trend: '+12%' },
  { name: 'Продукты', value: 6200, trend: '+8%' },
  { name: 'Одежда', value: 4100, trend: '-3%' },
  { name: 'Мебель', value: 3800, trend: '+5%' },
];

const suppliers = [
  { id: 1, name: 'ООО "ТехноСнаб"', category: 'Электроника', rating: 4.8, orders: 45, status: 'active' },
  { id: 2, name: 'ИП Сидоров А.В.', category: 'Продукты', rating: 4.5, orders: 38, status: 'active' },
  { id: 3, name: 'ТД "МебельПром"', category: 'Мебель', rating: 4.2, orders: 22, status: 'pending' },
  { id: 4, name: 'ООО "ФешнГрупп"', category: 'Одежда', rating: 4.6, orders: 31, status: 'active' },
];

const recentHistory = [
  { id: 1, date: '15.01.2026', type: 'upload', file: 'inventory_jan.xlsx', status: 'completed' },
  { id: 2, date: '14.01.2026', type: 'order', supplier: 'ООО "ТехноСнаб"', amount: '248 500 ₽', status: 'completed' },
  { id: 3, date: '12.01.2026', type: 'analysis', file: 'sales_data.xlsx', status: 'completed' },
  { id: 4, date: '10.01.2026', type: 'order', supplier: 'ИП Сидоров А.В.', amount: '156 200 ₽', status: 'processing' },
];

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState('forecast');
  const [weeklyStock, setWeeklyStock] = useState('2');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File | null) => {
    if (!file) return;
    
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      setSelectedFile(file);
      toast({
        title: "Файл загружен!",
        description: `${file.name} готов к анализу`,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Поддерживаются только .xlsx, .xls, .csv файлы",
        variant: "destructive",
      });
    }
  };

  const calculateWeeklyStockOrder = () => {
    const multiplier = parseFloat(weeklyStock);
    return forecastData.map(item => ({
      ...item,
      order: item.forecast ? Math.round(item.forecast * multiplier / 2) : null
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex h-screen">
        <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Icon name="TrendingUp" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">SupplyHub</h1>
                <p className="text-xs text-sidebar-foreground/60">Analytics Pro</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Button variant="default" className="w-full justify-start gap-3" onClick={() => setActiveTab('forecast')}>
              <Icon name="LayoutDashboard" size={20} />
              Дашборд
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setUploadDialogOpen(true)}
            >
              <Icon name="Upload" size={20} />
              Загрузка файлов
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setActiveTab('categories')}
            >
              <Icon name="LineChart" size={20} />
              Аналитика
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => toast({ title: "Раздел заказов", description: "В разработке" })}
            >
              <Icon name="ShoppingCart" size={20} />
              Заказы
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => toast({ title: "Справочник поставщиков", description: "В разработке" })}
            >
              <Icon name="Users" size={20} />
              Поставщики
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => toast({ title: "История операций", description: "В разработке" })}
            >
              <Icon name="Clock" size={20} />
              История
            </Button>
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => toast({ title: "Настройки", description: "В разработке" })}
            >
              <Icon name="Settings" size={20} />
              Настройки
            </Button>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <header className="bg-card/50 backdrop-blur-sm border-b sticky top-0 z-10">
            <div className="px-8 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Аналитическая панель</h2>
                <p className="text-sm text-muted-foreground">Прогнозирование и управление закупками</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({ title: "Экспорт отчета", description: "Функция готовится к запуску" })}
                >
                  <Icon name="Download" size={16} className="mr-2" />
                  Экспорт
                </Button>
                <Button 
                  size="sm" 
                  className="gradient-primary"
                  onClick={() => toast({ title: "Создание заказа", description: "Откроется форма создания заказа" })}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать заказ
                </Button>
              </div>
            </div>
          </header>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription>Общий объем заказов</CardDescription>
                  <CardTitle className="text-3xl">1.2M ₽</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="default" className="bg-accent/10 text-accent hover:bg-accent/20">
                      <Icon name="TrendingUp" size={12} className="mr-1" />
                      +12.5%
                    </Badge>
                    <span className="text-muted-foreground">за месяц</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-secondary hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription>Активные поставщики</CardDescription>
                  <CardTitle className="text-3xl">24</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="default" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                      <Icon name="Users" size={12} className="mr-1" />
                      +3
                    </Badge>
                    <span className="text-muted-foreground">новых</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription>Точность прогноза</CardDescription>
                  <CardTitle className="text-3xl">94.2%</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={94.2} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">За последние 3 месяца</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardDescription>Файлов обработано</CardDescription>
                  <CardTitle className="text-3xl">156</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">
                      <Icon name="FileSpreadsheet" size={12} className="mr-1" />
                      Excel
                    </Badge>
                    <span className="text-muted-foreground">в этом месяце</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="forecast">
                  <Icon name="TrendingUp" size={16} className="mr-2" />
                  Прогноз потребностей
                </TabsTrigger>
                <TabsTrigger value="categories">
                  <Icon name="PieChart" size={16} className="mr-2" />
                  По категориям
                </TabsTrigger>
                <TabsTrigger value="upload">
                  <Icon name="Upload" size={16} className="mr-2" />
                  Загрузка данных
                </TabsTrigger>
              </TabsList>

              <TabsContent value="forecast" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Прогноз потребностей на 3 месяца</CardTitle>
                        <CardDescription>
                          Анализ трендов и рекомендуемые объемы заказов на основе исторических данных
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Недельный запас:</span>
                        <Select value={weeklyStock} onValueChange={setWeeklyStock}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 нед</SelectItem>
                            <SelectItem value="2">2 нед</SelectItem>
                            <SelectItem value="3">3 нед</SelectItem>
                            <SelectItem value="4">4 нед</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={calculateWeeklyStockOrder()}>
                          <defs>
                            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '0.5rem'
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="actual" 
                            stroke="hsl(var(--secondary))" 
                            fill="hsl(var(--secondary) / 0.2)"
                            name="Факт"
                            strokeWidth={2}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="forecast" 
                            stroke="hsl(var(--primary))" 
                            fill="url(#colorForecast)"
                            name="Прогноз"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="order" 
                            stroke="hsl(var(--accent))" 
                            fill="url(#colorOrder)"
                            name={`Рекомендация (${weeklyStock} нед)`}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Объем заказов по категориям</CardTitle>
                      <CardDescription>Распределение за текущий период</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                            <YAxis stroke="hsl(var(--muted-foreground))" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '0.5rem'
                              }}
                            />
                            <Bar 
                              dataKey="value" 
                              fill="hsl(var(--primary))" 
                              radius={[8, 8, 0, 0]}
                              name="Объем, тыс. ₽"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Тренды по категориям</CardTitle>
                      <CardDescription>Изменение спроса относительно прошлого периода</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categoryData.map((cat) => (
                          <div key={cat.name} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon name="Package" size={20} className="text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{cat.name}</p>
                                <p className="text-sm text-muted-foreground">{cat.value.toLocaleString()} тыс. ₽</p>
                              </div>
                            </div>
                            <Badge 
                              variant={cat.trend.startsWith('+') ? 'default' : 'destructive'}
                              className={cat.trend.startsWith('+') ? 'bg-accent/10 text-accent hover:bg-accent/20' : ''}
                            >
                              {cat.trend.startsWith('+') ? (
                                <Icon name="TrendingUp" size={12} className="mr-1" />
                              ) : (
                                <Icon name="TrendingDown" size={12} className="mr-1" />
                              )}
                              {cat.trend}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Загрузка Excel файлов</CardTitle>
                    <CardDescription>
                      Нажмите кнопку "Загрузка файлов" в меню слева для начала работы
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                        <Icon name="FileSpreadsheet" size={32} className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">Используйте модуль загрузки файлов</p>
                      <Button onClick={() => setUploadDialogOpen(true)}>
                        <Icon name="Upload" size={16} className="mr-2" />
                        Открыть загрузчик
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Поставщики</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toast({ title: "Добавление поставщика", description: "В разработке" })}
                    >
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить
                    </Button>
                  </div>
                  <CardDescription>Справочник активных партнеров</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {suppliers.map((supplier) => (
                      <div 
                        key={supplier.id} 
                        className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{supplier.name}</p>
                            <p className="text-sm text-muted-foreground">{supplier.category}</p>
                          </div>
                          <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                            {supplier.status === 'active' ? 'Активен' : 'Ожидание'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                            <span>{supplier.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Icon name="ShoppingCart" size={14} />
                            <span>{supplier.orders} заказов</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>История операций</CardTitle>
                  <CardDescription>Последние действия в системе</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentHistory.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.type === 'upload' ? 'bg-secondary/10' :
                          item.type === 'order' ? 'bg-accent/10' :
                          'bg-primary/10'
                        }`}>
                          <Icon 
                            name={
                              item.type === 'upload' ? 'Upload' :
                              item.type === 'order' ? 'ShoppingCart' :
                              'LineChart'
                            } 
                            size={18}
                            className={
                              item.type === 'upload' ? 'text-secondary' :
                              item.type === 'order' ? 'text-accent' :
                              'text-primary'
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.type === 'upload' && `Загружен файл: ${item.file}`}
                            {item.type === 'order' && `Заказ: ${item.supplier}`}
                            {item.type === 'analysis' && `Анализ: ${item.file}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                        <Badge 
                          variant={item.status === 'completed' ? 'default' : 'secondary'}
                          className={item.status === 'completed' ? 'bg-accent/10 text-accent hover:bg-accent/20' : ''}
                        >
                          {item.status === 'completed' ? 'Завершено' : 'В обработке'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Загрузка файлов</DialogTitle>
            <DialogDescription>
              Поддерживаются форматы: .xlsx, .xls, .csv (максимум 10 МБ)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-border hover:border-primary/50'
              } cursor-pointer`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const file = e.dataTransfer.files[0];
                handleFileSelect(file);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  handleFileSelect(file || null);
                }}
              />
              <div className="flex flex-col items-center gap-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isDragging ? 'bg-primary/20' : 'bg-primary/10'
                }`}>
                  <Icon name="Upload" size={28} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg mb-1">
                    {isDragging ? 'Отпустите файл' : 'Перетащите файлы сюда'}
                  </p>
                  <p className="text-sm text-muted-foreground">или нажмите для выбора</p>
                </div>
              </div>
            </div>

            {selectedFile && (
              <div className="p-4 rounded-lg border bg-muted/30 animate-fade-in">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon name="FileSpreadsheet" size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} МБ
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gradient-primary"
                    onClick={() => {
                      toast({
                        title: "Анализ запущен",
                        description: "Обработка данных займет несколько секунд...",
                      });
                      setTimeout(() => {
                        toast({
                          title: "Анализ завершен!",
                          description: "Данные успешно обработаны и добавлены в прогноз",
                        });
                        setUploadDialogOpen(false);
                        setActiveTab('forecast');
                      }, 2000);
                    }}
                  >
                    <Icon name="Play" size={16} className="mr-2" />
                    Анализировать
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => toast({ title: "Скачать шаблон", description: "Функция готовится" })}
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Шаблон
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default Index;
