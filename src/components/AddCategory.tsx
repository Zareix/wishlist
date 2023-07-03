import { type Category } from '@prisma/client';
import { CheckCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useState, useTransition } from 'react';
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
import { addCategory } from '@/utils/actions';

type Inputs = Pick<Category, 'name' | 'parentCategoryId'>;

const AddCategory = ({
  messages,
  categories,
}: {
  messages: IntlMessages['AddCategory'];
  categories: Array<Pick<Category, 'name' | 'id'>>;
}) => {
  const [isPending, startTransition] = useTransition();
  const [, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<Inputs>();

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
    startTransition(() => {
      addCategory(data)
        .then(() => {
          router.refresh();
          setIsSuccess(true);
        })
        .catch(() => {
          setIsError(true);
        });
    });
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
          <DialogTitle>{messages.title}</DialogTitle>
        </DialogHeader>
        {isSuccess ? (
          <>
            <div className="mx-auto flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              {messages.form.success}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <InputGroup className="justify-items-start">
              <Label>{messages.form.name}</Label>
              <Input
                placeholder={messages.form.name}
                {...register('name', {
                  required: messages.form.errorRequired,
                  pattern: {
                    value: /^[a-zA-Z0-9 ]+$/,
                    message: messages.form.errorFormat,
                  },
                })}
              />
              {errors.name && <InputError>{errors.name.message}</InputError>}
            </InputGroup>
            <InputGroup className="justify-items-start">
              <Label>{messages.form.parentCategory}</Label>
              <Controller
                control={control}
                name="parentCategoryId"
                render={({ field }) => (
                  <>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={messages.form.parentCategoryPlaceholder}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem value={category.id} key={category.id}>
                            {category.name}
                          </SelectItem>
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
          {isSuccess ? (
            <DialogTrigger asChild>
              <Button
                type="button"
                onClick={() => {
                  reset();
                  reset();
                }}
                variant="outline"
                className="mt-2"
              >
                {messages.form.close}
              </Button>
            </DialogTrigger>
          ) : (
            <div className="flex gap-2">
              <DialogTrigger asChild>
                <Button
                  type="button"
                  onClick={() => {
                    reset();
                    reset();
                  }}
                  variant="outline"
                  className="w-1/2"
                >
                  {messages.form.close}
                </Button>
              </DialogTrigger>
              <Button
                type="button"
                disabled={isPending}
                onClick={() => handleSubmit(onSubmit)()}
                className="w-1/2"
              >
                {messages.form.submit}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
