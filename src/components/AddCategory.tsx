import { type Category } from '@prisma/client';
import { CheckCircle, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input, InputError, InputGroup } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/utils/api';

type Inputs = Pick<Category, 'name' | 'parentCategoryId'>;

const AddCategory = ({
  categories,
  refetchCategories,
}: {
  categories: Array<Pick<Category, 'name' | 'id'>>;
  refetchCategories: () => void;
}) => {
  const t = useTranslations('AddCategory');
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>();
  const addCategoryMutation = api.categories.create.useMutation();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    if (
      categories.find(
        (category) =>
          category.name.toLocaleLowerCase() === data.name.toLocaleLowerCase(),
      )
    ) {
      setError('name', {
        type: 'manual',
        message: 'This category already exists',
      });
    }
    addCategoryMutation
      .mutateAsync(data)
      .then(() => {
        refetchCategories();
      })
      .catch(console.error);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" type="button">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        {addCategoryMutation.isSuccess ? (
          <>
            <div className="mx-auto flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              {t('form.success')}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <InputGroup className="justify-items-start">
              <Label>{t('form.name')}</Label>
              <Input
                placeholder={t('form.name')}
                {...register('name', {
                  required: t('form.errorRequired'),
                  pattern: {
                    value: /^[a-zA-Z0-9 ]+$/,
                    message: t('form.errorFormat'),
                  },
                })}
              />
              {errors.name && <InputError>{errors.name.message}</InputError>}
            </InputGroup>
            <InputGroup className="justify-items-start">
              <Label>{t('form.parentCategory')}</Label>
              <Controller
                control={control}
                name="parentCategoryId"
                render={({ field }) => (
                  <>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t('form.parentCategoryPlaceholder')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <>
                            <SelectItem value={category.id} key={category.id}>
                              {category.name}
                            </SelectItem>
                          </>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
              {errors.parentCategoryId && (
                <InputError>{errors.parentCategoryId.message}</InputError>
              )}
            </InputGroup>
          </div>
        )}
        <DialogFooter>
          {addCategoryMutation.isSuccess ? (
            <DialogTrigger asChild>
              <Button
                type="button"
                onClick={() => {
                  addCategoryMutation.reset();
                  reset();
                }}
                variant="outline"
                className="mt-2"
              >
                {t('form.close')}
              </Button>
            </DialogTrigger>
          ) : addCategoryMutation.isError ? (
            <Button
              type="button"
              onClick={() => {
                addCategoryMutation.reset();
              }}
              variant="destructive"
              className="mt-2"
            >
              {t('form.reset')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  onClick={() => {
                    addCategoryMutation.reset();
                    reset();
                  }}
                  variant="outline"
                  className="w-1/2"
                >
                  {t('form.close')}
                </Button>
              </DialogTrigger>
              <Button
                type="button"
                disabled={addCategoryMutation.isLoading}
                onClick={() => handleSubmit(onSubmit)()}
                className="w-1/2"
              >
                {t('form.submit')}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
